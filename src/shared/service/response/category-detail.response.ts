import { Content } from "../../model/content";
import { Category } from "../../model/category";

export interface CategoryDetailResponse {
  Category: Category;
  SubCategory: Category[];
  Content: Content[];
}
