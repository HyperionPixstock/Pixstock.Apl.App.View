import { Content, PopoverController, Navbar } from 'ionic-angular';
import { Logger } from 'angular2-logger/core';
import { NgZone, ViewChild } from '@angular/core';
import { Toolmenu } from '../../pages/toolmenu/toolmenu';
import { IntentMessage } from '../pixstock/intent-message';
import { IpcMessage } from '../pixstock/ipc-message';
import { MessagingService } from '../service/messaging.service';

/**
 * コンテント画面の基本クラスです
 */
export abstract class ContentPageBase {
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content: Content;

  /**
   *
   */
  mImageHeight: Number;

  /**
   * コンストラクタ
   *
   * @param _logger
   * @param _ngZone
   * @param popoverCtrl
   */
  constructor(protected _logger: Logger, protected _ngZone: NgZone, protected popoverCtrl: PopoverController, protected messaging: MessagingService) {
    window.onresize = (e) => {
      //ngZone.run will help to run change detection
      this._ngZone.run(() => {
        this.fitImageContainer();
        this.OnWindowResize();
      });
    };
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.screenBack();
    }
  }

  ionViewDidEnter() {
    this._logger.debug("ContentPageBase::ionViewDidEnter - IN");
    this.fitImageContainer();
  }

  fitImageContainer(): void {
    let dimention = this.content.getContentDimensions();
    this.mImageHeight = dimention.contentHeight - dimention.contentTop + 46; // 46は、ヘッダー領域の高さ（環境依存）
  }

  public presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(Toolmenu);
    popover.present({
      ev: myEvent
    });
  }

  public screenBack() {
    this._logger.debug("[ContentPageBase][screenBack] Execute screenBack");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_BACK";
    intentMessage.Parameter = "BACK";

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    this.messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  abstract OnWindowResize(): any;
}
