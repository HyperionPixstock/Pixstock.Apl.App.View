import { Category } from "../../model/category";
import { Content } from "../../model/content";

/**
 * IPC_UPDATEPROPイベントのパラメータ
 */
export interface IpcUpdatePropResponse {
  PropertyName: string;
  Value: any;
}

/**
 * PropertyNameがCategoryList
 */
export interface CategoryListUpdateProp {
  CategoryList: Category[];
}

/**
 *
 */
export interface ContentListUpdateProp {
  ContentList: Content[];
}

/**
 *
 */
export interface PreviewContentProp {
  Content: Content;
  Category: Category;
}
