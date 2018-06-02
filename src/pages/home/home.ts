import { Component, NgZone } from '@angular/core';
import {
  MenuController,
  NavController,
  PopoverController
} from 'ionic-angular';
import { ContentPageBase } from '../../shared/pages/ContentPageBase';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import { ThumbnailListPage } from '../thumbnail-list/thumbnail-list';
import { LabelListPage } from '../label-list/label-list';
import { IpcMessage } from '../../shared/pixstock/ipc-message';
import { IntentMessage } from '../../shared/pixstock/intent-message';
import { NaviService } from '../../shared/service/navi.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends ContentPageBase {

  /**
   * コンストラクタ
   *
   * @param navCtrl
   * @param _logger
   * @param _pixstock
   * @param popoverCtrl
   * @param menuCtrl
   * @param ngZone
   */
  constructor(public navCtrl: NavController
    , public _logger: Logger
    , public _pixstock: MessagingService
    , public popoverCtrl: PopoverController
    , public menuCtrl: MenuController
    , public ngZone: NgZone
    , private naviService: NaviService
  ) {
    super(_logger, ngZone, popoverCtrl, _pixstock);
    _logger.info("HomePage アプリケーションの初期化 v0.0.1#4");
  }

  /**
   * @inheritDoc
   */
  OnWindowResize() {

  }

  naviThumbnailList(): void {
    this.navCtrl.push(ThumbnailListPage);
  }

  naviLabelList(): void {
    this.navCtrl.push(LabelListPage);
  }

  /**
   * 左メニュー(ID:menu_1)の可視状態を切り替える
   */
  toggleMenuLeft(): void {
    // 下記のように2つのMenu定義を切り替えることで、メニュー表示内容を変更できる。
    if (this.menuCtrl.isEnabled("menu_1")) {
      this.menuCtrl.enable(false, "menu_1");
      this.menuCtrl.enable(true, "menu_1b");
    } else {
      this.menuCtrl.enable(true, "menu_1");
      this.menuCtrl.enable(false, "menu_1b");
    }
  }

  showTestPage1() {

  }

  fireIpcHello() {
    this._pixstock.ipcRenderer.send("HELLO");
  }

  fireIpcHelloIntent() {
    this._logger.debug("Execute fireIpcHelloIntent");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_TOPSCREEN";
    intentMessage.Parameter = "Parameterです";

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    this._pixstock.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  fireIpcHelloIntent1_2() {
    this._logger.debug("Execute fireIpcHelloIntent1_2");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_ThumbnailListPage";
    intentMessage.Parameter = "Parameterです";

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    this._pixstock.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  fireIpcHelloIntent2() {
    this._logger.debug("Execute fireIpcHelloIntent2a");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_BACK";
    intentMessage.Parameter = "Parameterです";

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    this._pixstock.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }
}
