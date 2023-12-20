import expressAsyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Product } from "../models/product.model";
import { SubCategory } from "../models/subCategory.model";
import { Category } from "./../models/category.model";
import { Status } from "../interfaces/status/status.enum";
import { IProduct } from "../interfaces/product/product.interface";
import { ICategory } from "../interfaces/category/category.interface";
import { ISubCategory } from "../interfaces/subcategory/subcategory.interface";
import { ApiFeatures } from "../utils/ApiFeatures";
import { IQuery } from "../interfaces/factory/factory.interface";
import { limitedForCategory } from "../utils/limits/limitsCategory";
import {
  getAllItems,
  getOneItemById,
} from "./factory.controller";
import { createMetaData, deleteMetaData } from "../utils/MetaData";
import { Meta } from "../models/meta.model";


// @desc     Get All Categories
// @route    GET/api/v1/categories
// @access   Public
export const getAllCategories = getAllItems(Category, ["metaDataId"]);

// @desc     Get Specific Category By Id
// @route    GET/api/v1/categories/:id
// @access   Public
export const getCategoryById = getOneItemById(Category, ["metaDataId"]);


// @desc     Get All Categories
// @route    GET/api/v1/categories/getAllCategoriesWithProducts
// @access   Public
export const getAllCategoriesWithProducts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let category = await Category.find();

    // category => products => [{category: ca, products}]

    let result: {
      category: ICategory;
      products: IProduct[];
    }[] = [];
    await Promise.all(
      category.map(async (cat) => {
        const mongoQuery = Product.find({ category: cat._id.toString() });
        const query = req.query as IQuery;


        const { data } = await new ApiFeatures(mongoQuery, query)
          .populate()
          .filter()
          .limitFields()
          .search()
          .sort()
          .paginate();


        // 3- get features
        if (data.length === 0) {
          return
        }
        result.push({
          category: cat,
          products: data,
        });
      })
    );

    result = result.sort((a, b) =>
      a.products.length < b.products.length ? 1 : -1
    );

    res.status(200).json({
      status: "success",
      data: result,
      success_en: "Successfully",
      success_ar: "تم بنجاح",
    });
  }
);


// @desc     Get All Categories
// @route    GET/api/v1/categories/getAllCategoriesWithProducts
// @access   Public
export const getAllCategoriesWithSubCategories = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let category = await Category.find();

    // category => products => [{category: ca, products}]

    let result: {
      category: ICategory;
      subCategories: ISubCategory[];
    }[] = [];
    await Promise.all(
      category.map(async (cat) => {
        const mongoQuery = SubCategory.find({ category: cat._id.toString() });
        const query = req.query as IQuery;


        const { data } = await new ApiFeatures(mongoQuery, query)
          .populate()
          .filter()
          .limitFields()
          .search()
          .sort()
          .paginate();


        // 3- get features
        result.push({
          category: cat,
          subCategories: data,
        });
      })
    );

    result = result.sort((a, b) =>
      a.subCategories.length < b.subCategories.length ? 1 : -1
    );

    res.status(200).json({
      status: "success",
      data: result,
      success_en: "Successfully",
      success_ar: "تم بنجاح",
    });
  }
);


// @desc     Create New Category
// @route    POST/api/v1/categories
// @access   Private (Admins) TODO: add the rest of the roles
export const createCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body
    const { name_en, name_ar, image } = req.body;

    // 2- get number of category that exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === limitedForCategory()) {
      return next(
        new ApiError(
          {
            en: `you can't add more than ${limitedForCategory()} categories`,
            ar: `لا يمكنك إضافة أكثر من ${limitedForCategory()} تصنيفات`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if category already exist
    const exist = await Category.findOne({
      $or: [{ name_en: name_en }, { name_ar: name_ar }],
    });

    if (exist) {
      return next(
        new ApiError(
          {
            en: `this category already exist`,
            ar: `هذا التصنيف موجود بالفعل`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- create category in mongooseDB
    const newCategory = await Category.create({
      name_en,
      name_ar,
      image,
    });

    const reference = newCategory._id;
    let dataRes ={
      newCategory,
      MetaData:{}
    };
    if(req.body.title_meta && req.body.desc_meta){
      const MetaData = await createMetaData(req, reference);
      await newCategory.updateOne({ metaDataId: MetaData._id });
      dataRes = {
        newCategory,
        MetaData
      };
    }
    
    // 5- send response
    res.status(201).json({
      status: "success",
      data: dataRes,
      success_en: "created successfully",
      success_ar: "تم الانشاء بنجاح",
    });
  }
);

// @desc     Update Specific Category By Id
// @route    PUT/api/v1/categories/:id
// @access   Private (Admins) TODO: add the rest of the roles
export const updateCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id for item from params
    const { id } = req.params;

    // 2- check if category not exist
    const category = await Category.findById(id);
    if (!category) {
      return next(
        new ApiError(
          {
            en: `Not Found Any Category With This Id: ${id}`,
            ar: `لا يوجد تصنيف بهذا الرقم : ${id}`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    //  3- check if meta already exist
    const exist = await Meta.findOne({ reference: id });
    if (!exist && req.body.title_meta && req.body.desc_meta) {
      const newMeta = await createMetaData(req, id);
      await Category.findByIdAndUpdate(
        id,
        { metaDataId: newMeta._id, ...req.body },
        { new: true }
      );
    } else if (exist && req.body.title_meta && req.body.desc_meta)  {
      await Meta.updateOne(
        { reference: id },
        { title_meta: req.body.title_meta, desc_meta: req.body.desc_meta }
      );
      await Category.findByIdAndUpdate(id, { ...req.body }, { new: true });
    }else {
      await Category.findByIdAndUpdate(id, { ...req.body }, { new: true });
    }

    // 4 - get updated document and populate it
    const document = await Category.findById(id).populate("metaDataId");

    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: document,
      success_en: "updated successfully",
      success_ar: "تم التعديل بنجاح",
    });
  }
);

// @desc     Delete Specific Category By Id
// @route    DELETE/api/v1/categories/:id
// @access   Private (Admins) TODO: add the rest of the roles
export const deleteCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // check if category contained any subcategories
    const subCategoryCount = await SubCategory.countDocuments({
      category: Object(id),
    });
    if (subCategoryCount) {
      return next(
        new ApiError(
          {
            en: `this category can't be deleted because it has subcategories`,
            ar: `لا يمكن حذف هذا التصنيف لأنه يحتوي على أقسام فرعية`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // check if category contained any products
    const productCount = await Product.countDocuments({ category: Object(id) });
    if (productCount) {
      return next(
        new ApiError(
          {
            en: `this category can't be deleted because it has products`,
            ar: `لا يمكن حذف هذا التصنيف لأنه يحتوي على منتجات`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    const deleted = await deleteMetaData(id);
    if (deleted) {
      await Category.findByIdAndDelete(id);
    } else {
      return next(
        new ApiError(
          {
            en: `this category can't be deleted because MetaData has not  deleted`,
            ar: ` لا يمكن حذف هذا التصنيف لأن البيانات الوصفية لم يتم حذفها`,
          },
          StatusCodes.FAILED_DEPENDENCY
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "deleted successfully",
      success_ar: "تم الحذف بنجاح",
    });
  }
);
