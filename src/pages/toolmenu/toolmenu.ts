import { Component } from "@angular/core";
import { IntentMessage } from "../../shared/pixstock/intent-message";
import { IpcMessage } from "../../shared/pixstock/ipc-message";
import { Logger } from "angular2-logger/core";
import { MessagingService } from "../../shared/service/messaging.service";

@Component({
  templateUrl: 'toolmenu.html'
})
export class Toolmenu {
  constructor(
    protected logger: Logger,
    protected messaging: MessagingService
  ) { }

  onTRNS_DEBUG_BACK() {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_DEBUG_BACK";
    intentMessage.Parameter = "TRNS_DEBUG_BACK";

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    this.messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }
}
