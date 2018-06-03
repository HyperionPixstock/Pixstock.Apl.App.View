import { Injectable, EventEmitter } from "@angular/core";
import { Category } from "../model/category";
import { Content } from "../model/content";

/**
 * ビューモデル
 */
@Injectable()
export class ViewModel {

  /**
   * サムネイル一覧画面のコンテント情報リスト
   */
  private _ContentListPageItem: ContentListPageItem[] = [];

  /**
   * ContentListPageItemプロパティ変更通知イベント
   */
  NotificationContentListPageItem: EventEmitter<ContentListPageItem[]> = new EventEmitter();

  /**
   * サムネイル一覧画面のサムネイル付きカテゴリ情報リスト（getter/setter未実装）
   */
  ThumbnailListPageItem: ThumbnailListPageItem[] = [];

  /**
   * サムネイル一覧画面のカテゴリリストで、遅延読み込み時のスピナ表示の有無を設定する（getter/setter未実装）
   */
  CategoryListLazyLoadSpinner: boolean = true;

  /**
   * プレビュー画面に表示するコンテント情報（getter/setter未実装）
   */
  PreviewContent: Content;

  /**
   * プレビュー画面に表示しているコンテント情報が所属するカテゴリ情報（getter/setter未実装）
   */
  PreviewCategory: Category;

  public get ContentListPageItem(): ContentListPageItem[] {
    return this._ContentListPageItem;
  }

  public set ContentListPageItem(value: ContentListPageItem[]) {
    this._ContentListPageItem = value;
    this.NotificationContentListPageItem.emit(this._ContentListPageItem);
  }

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
