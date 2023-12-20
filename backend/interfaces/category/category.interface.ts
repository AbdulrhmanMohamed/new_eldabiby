import { Document } from "mongoose";

export interface ICategory extends Document {
  name_en: string;
  name_ar: string;
  revinue?: number;
  subCategoriesCount?: number;
  productsCount?: number;
  image?: string;
  title_meta: string;
  desc_meta: string;
  metaDataId?: string;
}
