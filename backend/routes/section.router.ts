import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { sectionValidator } from "../validations/section.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createSection,
  deleteSection,
  getAllSections,
  getSectionById,
  getSectionByName,
  updateSection,
} from "./../controllers/section.controller";

const sectionRouter = Router();

sectionRouter
  .route("/")
  .get(getAllSections)  
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(sectionValidator),
    createSection
  );  
sectionRouter.route('/sectionName/:sectionName').get(getSectionByName)
sectionRouter
  .route("/:id")
  .get(getSectionById)  
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(sectionValidator),
    updateSection
  )  
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteSection
  );  

export default sectionRouter;
