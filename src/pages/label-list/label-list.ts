import { ContentPageBase } from "../../shared/pages/ContentPageBase";
import { Component, NgZone } from "@angular/core";
import { Logger } from "angular2-logger/core";
import { PopoverController, NavController } from "ionic-angular";
import { LabelDao } from "../../shared/dao/label.dao";
import { Label } from "../../shared/model/label";
import { ThumbnailListPage } from "../thumbnail-list/thumbnail-list";
import { ThumbnailListNavParam } from "../../shared/infra/navparam.thumbnail-list";
import { MessagingService } from "../../shared/service/messaging.service";

@Component({
  selector: 'page-label-list',
  templateUrl: 'label-list.html'
})
export class LabelListPage extends ContentPageBase {

  mItems: Array<Label>;

  constructor(
    protected _logger: Logger
    , protected navCtrl: NavController
    , protected _ngZone: NgZone
    , protected popoverCtrl: PopoverController
    , protected labelDao: LabelDao
    , protected messaging: MessagingService) {
    super(_logger, _ngZone, popoverCtrl, messaging);

    this.mItems = [];
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();

    this.labelDao.loadLabelList().subscribe((result) => {
      this.mItems = result.Labels;
    });
  }

  OnWindowResize() {
    // EMPTY
  }

  onClick_ContentItemContainer(item: Label): void {
    this._logger.info("[LabelListPage.onClick_ContentItemContainer][IN]", item);
    this.transitionThumbnailListPage(item.Id);
  }

  /**
   *
   * @param labelId とりあえず、1つのラベルのみ指定
   */
  transitionThumbnailListPage(labelId: Number): void {
    var param: ThumbnailListNavParam = { Rule: labelId.toString() };
    this.navCtrl.push(ThumbnailListPage, { Rule_Label: param });
  }
}
