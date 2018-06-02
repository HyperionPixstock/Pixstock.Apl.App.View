import { Injectable } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../service/messaging.service';
import { Observable } from 'rxjs';
import { ResultLoadCategory } from '../infra/load.category';
import { CategoryDetailResponse } from '../service/response/category-detail.response';

/**
 * カテゴリ情報の操作
 */
@Injectable()
export class CategoryDao {
  constructor(
    protected _logger: Logger
    , protected _MessagingService: MessagingService
  ) {

  }

  /**
   * 任意のカテゴリ情報を読み込みます
   *
   * @param categoryId 読み込むカテゴリ情報のキー
   */
  public loadCategory(categoryId: Number, offsetSubCategory: Number = 0, limitSubCategory: Number = 0): Observable<ResultLoadCategory> {
    this._logger.debug("[CategoryDao.loadCategory][IN]");
    return Observable.create(observer => {
      //this._logger.info("sendSync EAV_GETCATEGORY", categoryId, offsetSubCategory);
      var param = { "CategoryId": categoryId, "OffsetSubCategory": offsetSubCategory, "LimitSubCategory": limitSubCategory };
      let response = this._MessagingService.ipcRenderer.sendSync("EAV_GETCATEGORY", param);
      let desobj = JSON.parse(response) as CategoryDetailResponse;
      this._logger.info("[DAO] loadCategory", desobj);
      var result: ResultLoadCategory = {
        Category: desobj.Category,
        Content: desobj.Content,
        SubCategory: desobj.SubCategory
      }
      observer.next(result);
    });
  }
}
