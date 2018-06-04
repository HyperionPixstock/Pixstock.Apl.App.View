import { MessagingService } from "./messaging.service";
import { IntentMessage } from "../pixstock/intent-message";
import { IpcMessage } from "../pixstock/ipc-message";

/**
 * BFFへのメッセージ送信をサポートするクラス
 */
export class MessagingHelper {
  /**
   * ACT_DISPLAY_PREVIEWCURRENTLISTメッセージを送信する
   *
   * @param messaging 送信コンテキスト
   * @param contentListPos コンテントリスト内の位置
   * @param updateCategoryDisplayInfo 所属カテゴリの表示情報を更新するかどうかのフラグ
   */
  static ACT_DISPLAY_PREVIEWCURRENTLIST(messaging: MessagingService, contentListPos: number, updateCategoryDisplayInfo: boolean) {
    let intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_DISPLAY_PREVIEWCURRENTLIST";
    intentMessage.Parameter = JSON.stringify({
      ContentListPos: contentListPos,
      UpdateCategoryDisplayInfo: updateCategoryDisplayInfo,
      UpdateLastDisplayContent: true // 表示継続機能
    });

    let ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  /**
   * 親階層カテゴリのサブカテゴリ一覧表示
   *
   * @param messaging 送信コンテキスト
   */
  static ACT_UpperCategoryList(messaging: MessagingService) {
    let intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_UpperCategoryList";
    intentMessage.Parameter = "";

    let ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  /**
   * GETCATEGORYメッセージを送信する
   *
   * @param messaging 送信コンテキスト
   * @param categoryId GETCATEGORYのCategoryIdプロパティ
   * @param offsetSubCategory GETCATEGORYのOffsetSubCategoryプロパティ
   */
  static GETCATEGORY(messaging: MessagingService, categoryId: number, offsetSubCategory: number) {
    let intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Server";
    intentMessage.MessageName = "GETCATEGORY";
    intentMessage.Parameter = JSON.stringify({
      CategoryId: categoryId,
      OffsetSubCategory: offsetSubCategory,
      LimitOffsetSubCategory: 7,
    });

    let ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  /**
   * GETCATEGORYCONTENTメッセージを送信する
   *
   * @param messaging 送信コンテキスト
   * @param categoryId GETCATEGORYCONTENTのパラメータ
   */
  static GETCATEGORYCONTENT(messaging: MessagingService, categoryId: number) {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Server";
    intentMessage.MessageName = "GETCATEGORYCONTENT";
    intentMessage.Parameter = categoryId.toString();

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  /**
   * TRNS_PreviewPage画面遷移メッセージを送信する
   *
   * @param messaging 送信コンテキスト
   * @param transrateParam
   */
  static TRNS_PreviewPage(messaging: MessagingService, transrateParam: number) {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "TRNS_PreviewPage";
    intentMessage.Parameter = transrateParam.toString();

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }
}
