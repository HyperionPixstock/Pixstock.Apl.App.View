import { Content } from '../model/content';
import { ContentDetailResponse } from '../../shared/service/response/content-detail.response';
import { Injectable, destroyPlatform } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import { Observable } from 'rxjs';
import { ResultLoadContent } from '../infra/load.content';

@Injectable()
export class ContentDao {
  constructor(
    private _logger: Logger,
    private _MessagingService: MessagingService
  ) {

  }

  /**
   * コンテント詳細情報取得API
   *
   * @param contentId 取得するコンテント情報
   */
  loadContent(contentId: Number): Observable<ResultLoadContent> {
    return Observable.create(observer => {
      let response = this._MessagingService.ipcRenderer.sendSync("EAV_GETCONTENT", contentId);

      let desobj = JSON.parse(response) as ContentDetailResponse;
      var result: ResultLoadContent = {
        Content: desobj.Content,
        Category: desobj.Category
      };
      observer.next(result);
    });
  }
}
