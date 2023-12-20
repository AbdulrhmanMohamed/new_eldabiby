import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  putCategoryValidation,
  postCategoryValidation,
} from "../validations/category.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getAllCategoriesWithProducts,
  getAllCategoriesWithSubCategories,
  updateCategory,
} from "../controllers/category.controller";
const categoryRouter = Router();

categoryRouter
  .route("/getAllCategoriesWithProducts")
  .get(getAllCategoriesWithProducts); //all

categoryRouter
  .route("/getAllCategoriesWithSubCategories")
  .get(getAllCategoriesWithSubCategories); //all

categoryRouter
  .route("/")
  .get(getAllCategories) //all
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(postCategoryValidation),
    createCategory
  ); //admin root admina adminb

categoryRouter
  .route("/:id")
  .get(getCategoryById) //all
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(putCategoryValidation),
    updateCategory
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteCategory
  ); //admin root admina adminb

export default categoryRouter;

// done
