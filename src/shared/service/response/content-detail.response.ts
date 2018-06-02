import { Content } from "../../model/content";
import { Category } from "../../model/category";

export interface ContentDetailResponse {
  Content: Content;
  Category: Category;
}
