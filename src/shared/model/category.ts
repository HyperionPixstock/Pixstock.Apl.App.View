import { Label } from "./label";

/**
 * カテゴリ情報モデルのインターフェース
 *
 * 各プロパティの詳細は、カテゴリ情報モデルを参照
 */
export interface Category {
  Id: number;
  Name: string;
  NextDisplayContentId: number | null;
  HasLinkSubCategoryFlag: boolean;
  Labels: Array<Label>;
}
