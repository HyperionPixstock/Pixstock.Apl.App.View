import { Component, NgZone, ViewChild } from '@angular/core';
import { Content } from '../../shared/model/content';
import { ContentPageBase } from '../../shared/pages/ContentPageBase';
import { LoadingController } from 'ionic-angular';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import {
  NavController,
  NavParams,
  PopoverController,
  Slides
} from 'ionic-angular';
import { Label } from '../../shared/model/label';
import { IntentMessage } from '../../shared/pixstock/intent-message';
import { IpcMessage } from '../../shared/pixstock/ipc-message';
import { ViewModel } from '../../shared/service/viewmodel';

/**
 * プレビュー画面コンポーネント
 */
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html'
})
export class PreviewPage extends ContentPageBase {
  @ViewChild(Slides) slides: Slides;

  /**
   * Trueの場合、スライダーモード
   */
  mEnableFitImageSliderMode: string = "IonSliders";

  mAllHiddenFlag: boolean = false;

  mEnableIonSlidersFlag: boolean = true;

  mEnableIonScrollFlag: boolean = false;

  /**
   * 画像拡大表示時の表示倍率(パーセンテージ)
   */
  mZoomWidth: number = 100;

  /**
   * コンストラクタ
   *
   * @param navCtrl
   * @param navParams
   * @param logger
   * @param messaging
   * @param contentDao
   * @param loadingCtrl
   * @param popoverCtrl
   * @param ngZone
   */
  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public logger: Logger
    , public messaging: MessagingService
    , public loadingCtrl: LoadingController
    , public popoverCtrl: PopoverController
    , public ngZone: NgZone
    , protected vm: ViewModel // 直接VMを、Htmlから呼び出します
  ) {
    super(logger, ngZone, popoverCtrl, messaging);
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();

    this.logger.debug("[PreviewPage][ionViewDidEnter] NavParams.data", this.navParams.data);

    // データ読み込みメッセージを送信する
    this.requestUpdateContent(this.navParams.data);
  }

  /**
   * @inheritDoc
   */
  OnWindowResize() {
    if (this.mEnableIonSlidersFlag) {
      this.invalidate(true);
      setTimeout(() => {
        this.invalidate(false);
        this.slides.resize();
        this.slides.update();
      }, 1);
    }
  }

  ngAfterViewInit() {
    this.logger.debug("ngAfterViewInit - IN", this.slides);
    var contentItemPosition = this.navParams.data;
    this.slides.initialSlide = contentItemPosition;
    this.logger.debug("ngAfterViewInit - OUT");
  }

  /**
   * スライドコントロールによる、アイテムスライドイベントのハンドラ
   */
  onIonSlideChange() {
    this.logger.debug("[onIonSlideChange] IN");
    let currentIndex = this.slides.getActiveIndex();
    this.requestUpdateContent(currentIndex);
    this.logger.debug("[onIonSlideChange] OUT");
  }

  disableFitImage() {
    // スライド表示モードとズーム表示モードの切り替え（トグル）を行う
    if (this.mEnableFitImageSliderMode == "IonSliders") {
      this.mEnableFitImageSliderMode = "IonScroll";
    } else {
      this.mEnableFitImageSliderMode = "IonSliders";
    }

    this.invalidate(false);
  }

  zoomUp() {
    this.logger.debug("IN - zoomUp");
    this.mZoomWidth = this.mZoomWidth + 10;
  }

  zoomDown() {
    this.logger.debug("IN - zoomDown");
    this.mZoomWidth = this.mZoomWidth - 10;
  }

  /**
   * プレビュー画面に表示しているコンテント情報を取得する
   *
   * @param targetListPos 取得するコンテント情報の、ナビゲーションリスト内での項目位置
   */
  private requestUpdateContent(targetListPos: number) {
    var intentMessage = new IntentMessage();
    intentMessage.ServiceType = "Workflow";
    intentMessage.MessageName = "ACT_DISPLAY_PREVIEWCURRENTLIST";
    intentMessage.Parameter = targetListPos.toString();

    var ipcMessage = new IpcMessage();
    ipcMessage.Body = JSON.stringify(intentMessage);
    this.messaging.ipcRenderer.send("PIXS_INTENT_MESSAGE", ipcMessage);
  }

  /**
   *
   * @param all プレビュー表示領域を隠すかどうかのフラグ
   */
  private invalidate(all: boolean) {
    if (all) {
      this.mEnableIonSlidersFlag = false;
      this.mEnableIonScrollFlag = false;
    } else {
      if (this.mEnableFitImageSliderMode == "IonSliders") {
        this.mEnableIonSlidersFlag = true;
        this.mEnableIonScrollFlag = false;
      } else {
        this.mEnableIonSlidersFlag = false;
        this.mEnableIonScrollFlag = true;
      }
    }
  }

}
