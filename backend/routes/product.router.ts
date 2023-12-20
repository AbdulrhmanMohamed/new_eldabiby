import { Router } from "express";
import { protectedMiddleware} from "../middlewares/protected.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import { validate } from "../middlewares/validation.middleware";
import {
  getAllProducts,
  getProductById,
  getAllProductsByCategoryId,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleLikeBySomeOneById,
} from "../controllers/product.controller";
import {
  postProductValidation,
  putProductValidation,
} from "../validations/product.validator";

const productRouter = Router();
// TODO: add the rest of the roles

productRouter
  .route("/")
  .get(getAllProducts) //all
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(postProductValidation),
    createProduct
  ); //admin root admina adminb

productRouter
  .route("/forSpecificCategory/:categoryId")
  .get(getAllProductsByCategoryId); //all

productRouter
  .route("/:id")
  .get(getProductById) //all
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(putProductValidation),
    updateProduct
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteProduct
  ); //admin root admina adminb

productRouter
  .route("/toggleLike/:productId")
  .post(protectedMiddleware, allowedTo(Role.USER), toggleLikeBySomeOneById); //user
export default productRouter;
