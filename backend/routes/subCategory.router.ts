import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  postSubCategoryValidation,
  putSubCategoryValidation,
} from "../validations/subCategory.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  getAllSubCategories,
  getAllSubCategoriesByCategoryId,
  getSubCategoryById,
  createSubCategory,
  updateSubCategoryById,
  deleteSubCategoryById,
} from "../controllers/subCategory.controller";

const subCategoriesRouter = Router();

subCategoriesRouter
  .route("/")
  .get(getAllSubCategories) //all
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(postSubCategoryValidation),
    createSubCategory
  ); //admin root admina adminb

subCategoriesRouter
  .route("/:id")
  .get(getSubCategoryById) //all
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(putSubCategoryValidation),
    updateSubCategoryById
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteSubCategoryById
  ); //admin root admina adminb

subCategoriesRouter
  .route("/forSpecificCategory/:categoryId")
  .get(getAllSubCategoriesByCategoryId); //all

export default subCategoriesRouter;
