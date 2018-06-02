import { Injectable } from "@angular/core";
import { Category } from "../model/category";
import { Content } from "../model/content";

/**
 * ビューモデル
 */
@Injectable()
export class ViewModel {
  /**
   * サムネイル一覧画面のサムネイル付きカテゴリ情報リスト
   */
  ThumbnailListPageItem: ThumbnailListPageItem[] = [];

  /**
   * サムネイル一覧画面のコンテント情報リスト
   */
  ContentListPageItem: ContentListPageItem[] = [];

  /**
   * サムネイル一覧画面のカテゴリリストで、遅延読み込み時のスピナ表示の有無を設定する
   */
  CategoryListLazyLoadSpinner: boolean = true;

  /**
   * プレビュー画面に表示するコンテント情報
   */
  PreviewContent: Content;

  /**
   * プレビュー画面に表示しているコンテント情報が所属するカテゴリ情報
   */
  PreviewCategory: Category;
}

export interface ThumbnailListPageItem {
  Selected: boolean;
  Category: Category;
  IsContent: boolean;
  IsSubCaetgory: boolean;
}

export interface ContentListPageItem {
  Content: Content;
}
