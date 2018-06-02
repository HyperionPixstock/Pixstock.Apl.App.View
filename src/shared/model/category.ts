import { Label } from "./label";

export interface Category {
  Id: number;
  Name: string;
  HasLinkSubCategoryFlag: boolean;
  Labels: Array<Label>;
}
