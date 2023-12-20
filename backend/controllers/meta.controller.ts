import {
  getAllItems,
  getOneItemById,
  updateOneItemById,
} from "./factory.controller";
import { Meta } from "../models/meta.model";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

// @desc    Get All Metas
// @route   POST /api/v1/metas
// @access  public (Admin)
export const getAllMetas = getAllItems(Meta);

// @desc    Get Specific Meta By Id
// @route   POST /api/v1/metas/:id
// @access  Private (Admin)
export const getMetaById = getOneItemById(Meta);

// @desc    Update Meta By Id
// @route   POST /api/v1/metas/:id
// @access  Private (Admin)
export const updateMeta = updateOneItemById(Meta);

// @desc    Get Meta By Refrence
// @route   POST /api/v1/metas/:id
// @access  public (Admin)
export const getMetaByRefrence = expressAsyncHandler(
  async (req: Request, res: Response) => {
    Meta.findOne({ reference: req.params.id })
      .then((data) => {
        return res
          .status(200)
          .json({
            message_en: "meta Fetched Successfully",
            message_ar: "تمت جلب البيانات  بنجاح",
            data,
          });
      })
      .catch((e) => {
        return res
          .status(400)
          .json({
            error_en: "Meta Not Found",
            error_ar: "لم يتم العثور على الميتا",
          });
      })
  }
);
