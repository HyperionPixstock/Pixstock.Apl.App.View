import { Injectable } from "@angular/core";
import { ViewModel } from "./viewmodel";
import { MessagingService } from "./messaging.service";
import { Logger } from "angular2-logger/core";

/**
 * デリバリーサービス
 */
@Injectable()
export class DeliveryService {
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
  }
}
