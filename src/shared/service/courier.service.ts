import { Injectable } from "@angular/core";
import { Logger } from "angular2-logger/core";
import { MessagingService } from "./messaging.service";
import { IpcUpdatePropResponse, CategoryListUpdateProp, ContentListUpdateProp, PreviewContentProp } from "./response/IpcUpdateProp.response";
import { ViewModel, ThumbnailListPageItem, ContentListPageItem } from "./viewmodel";
import { Category } from "../model/category";
import { Content } from "../model/content";

/**
 * クーリエサービス
 */
@Injectable()
export class CourierService {
  initializedFlag: boolean = false;

  /**
   * コンストラクタ
   *
   * @param logger ロガー
   * @param messagingSrv BFF間のメッセージサービス
   */
  constructor(
    protected logger: Logger,
    protected messagingSrv: MessagingService,
    protected viewModel: ViewModel) {
  }

  public initialize() {
    if (this.initializedFlag) return;
    this.initializedFlag = true;

    this.messagingSrv.UpdateProp.subscribe((prop: IpcUpdatePropResponse) => {
      if (prop.PropertyName == "CategoryList") {
        let objValue = JSON.parse(prop.Value) as CategoryListUpdateProp;
        if (objValue != null) {
          this.updateCategoryList(objValue);
        } else {
          this.logger.warn("プロパティを正常に復号化できませんでした");
        }
        this.viewModel.CategoryListLazyLoadSpinner = false;
      } else if (prop.PropertyName == "ContentList") {
        let objValue = JSON.parse(prop.Value) as ContentListUpdateProp;
        if (objValue != null) {
          this.updateContentList(objValue);
        } else {
          this.logger.warn("プロパティを正常に復号化できませんでした");
        }
      } else if (prop.PropertyName == "PreviewContent") {
        let objValue = JSON.parse(prop.Value) as PreviewContentProp;
        if (objValue != null) {
          this.viewModel.PreviewContent = objValue.Content;
          this.viewModel.PreviewCategory = objValue.Category;
        } else {
          this.logger.warn("プロパティを正常に復号化できませんでした");
        }
      }

      // TODO: ここに、各プロパティ名の処理を追加します
    });
  }

  private updateCategoryList(objValue: CategoryListUpdateProp) {
    objValue.CategoryList.forEach((inprop: Category) => {
      let listitem = {} as ThumbnailListPageItem;
      listitem.Selected = false;
      listitem.Category = inprop;
      listitem.IsContent = true;
      if (inprop.HasLinkSubCategoryFlag) {
        listitem.IsSubCaetgory = true;
      } else {
        listitem.IsSubCaetgory = false;
      }
      this.viewModel.ThumbnailListPageItem.push(listitem);
    });
  }

  private updateContentList(objValue: ContentListUpdateProp) {
    this.viewModel.ContentListPageItem = [];

    objValue.ContentList.forEach((inprop: Content) => {
      let listitem = {} as ContentListPageItem;
      listitem.Content = inprop;

      this.viewModel.ContentListPageItem.push(listitem);
    });
  }
}
