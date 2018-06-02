import { Category } from "../model/category";
import { Content } from "../model/content";

export interface ResultLoadCategory {
  Category: Category;
  SubCategory: Category[];
  Content: Content[];
}
