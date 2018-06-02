import { Injectable, destroyPlatform } from "@angular/core";
import { Logger } from "angular2-logger/core";
import { MessagingService } from "../service/messaging.service";
import { Label } from "../model/label";
import { Observable } from "rxjs";
import { Category } from "../model/category";

@Injectable()
export class LabelDao {
  constructor(
    private _logger: Logger,
    private _MessagingService: MessagingService
  ) {

  }

  /**
   * ラベル情報一覧を取得する
   */
  public loadLabelList(): Observable<ResultLoadLabelList> {
    this._logger.debug("[LabelDao.loadLabelList][IN]");
    return Observable.create(observer => {
      let response = this._MessagingService.ipcRenderer.sendSync("EAV_GETLABELLIST");
      let desobj = JSON.parse(response) as Label[];
      var result: ResultLoadLabelList = {
        Labels: desobj
      };
      observer.next(result);
    });
  }

  /**
   * ラベルリンクデータ情報取得API
   *
   * @param query
   */
  public findLabelLinkCategory(query: string): Observable<ResultFindLabelLinkCategory> {
    this._logger.debug("[LabelDao.findLabelLinkCategory][IN]");
    return Observable.create(observer => {
      let response = this._MessagingService.ipcRenderer.sendSync("EAV_GETLABELLINKCATEGORYLIST", query);
      let desobj = JSON.parse(response) as Category[];
      var result: ResultFindLabelLinkCategory = {
        Categories: desobj
      };
      observer.next(result);
    });
  }
}

export interface ResultLoadLabelList {
  Labels: Label[];
}

export interface ResultFindLabelLinkCategory {
  Categories: Category[];
}
