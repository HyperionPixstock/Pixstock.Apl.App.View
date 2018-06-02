import { ContentPageBase } from "../../shared/pages/ContentPageBase";
import { Component, NgZone } from "@angular/core";
import { MessagingService } from "../../shared/service/messaging.service";
import { PopoverController } from "ionic-angular";
import { Logger } from "angular2-logger/core";
import { IntentMessage } from "../../shared/pixstock/intent-message";
import { IpcMessage } from "../../shared/pixstock/ipc-message";

/**
 * ウェルカム画面
 */
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage extends ContentPageBase {

  /**
   * コンストラクタ
   *
   * @param logger
   * @param ngZone
   * @param popoverCtrl
   * @param messaging
   */
  constructor(
    protected logger: Logger,
    protected ngZone: NgZone,
    protected popoverCtrl: PopoverController,
    protected messaging: MessagingService
  ) {
    super(logger, ngZone, popoverCtrl, messaging);
  }

  OnWindowResize() {

  }

  fireIpcHelloIntent() {
    this._logger.debug("Execute fireIpcHelloIntent");
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_TOPSCREEN";
    intentMessage.Parameter = "";

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    this.messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }
}
