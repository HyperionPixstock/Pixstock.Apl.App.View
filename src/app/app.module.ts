import { BrowserModule } from '@angular/platform-browser';
import { CategoryDao } from '../shared/dao/category.dao';
import { ContentDao } from '../shared/dao/content.dao';
import {
  ErrorHandler,
  NgModule,
  NgZone,
  ViewChild
} from '@angular/core';
import { HomePage } from '../pages/home/home';
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  Nav
} from 'ionic-angular';
import { Level as LoggerLevel, Logger, Options as LoggerOptions } from 'angular2-logger/core';
import { MessagingService } from '../shared/service/messaging.service';
import { MyApp } from './app.component';
import { PreviewPage } from '../pages/preview/preview';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ThumbnailListPage } from '../pages/thumbnail-list/thumbnail-list';
import { Toolmenu } from '../pages/toolmenu/toolmenu';
import { LabelDao } from '../shared/dao/label.dao';
import { LabelListPage } from '../pages/label-list/label-list';
import { NaviService } from '../shared/service/navi.service';
import { ViewModel } from '../shared/service/viewmodel';
import { CourierService } from '../shared/service/courier.service';
import { WelcomePage } from '../pages/welcome/welcome';
import { DeliveryService } from '../shared/service/delivery.service';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    HomePage,
    ThumbnailListPage,
    PreviewPage,
    LabelListPage,
    Toolmenu,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: "HomePage", segment: "pixstock" },
        { component: ThumbnailListPage, name: "ThumbnailListPage", segment: "pixstock" },
        { component: PreviewPage, name: "PreviewPage", segment: "pixstock" }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    HomePage,
    ThumbnailListPage,
    PreviewPage,
    LabelListPage,
    Toolmenu
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LoggerOptions, useValue: { level: LoggerLevel.DEBUG } },
    Logger,
    ContentDao,
    CategoryDao,
    LabelDao,
    ViewModel,
    MessagingService,
    NaviService,
    CourierService,
    DeliveryService
  ]
})
export class AppModule {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = WelcomePage;

  constructor(private _logger: Logger,
    private _ngZone: NgZone,
    private _pixstock: MessagingService,
    private courierService: CourierService,
    private deliveryService: DeliveryService,
    private naviService: NaviService
  ) {

    _logger.info("アプリケーションの初期化 v0.0.1#6");

    window['angularComponentRef'] = {
      component: this,
      zone: this._ngZone
    };

    var parent: any = window.parent; // JSのWindowオブジェクト
    _logger.info("ParentLocation = " + parent.location);

    if (parent.getFirstLoad == null) {
      _logger.error("getFirstLoadの定義を見つけることができません");
    } else {
      let flag = parent.getFirstLoad();
      if (flag == false) {
        _logger.info("AApp初期読み込み判定");
        parent.setFirstLoad();
        this._pixstock.initialize(parent.getIpc(), true, this._logger); // IPCオブジェクト取得
        this.courierService.initialize();
        this.deliveryService.initialize();
        this.naviService.initialize();
      } else {
        _logger.info("AApp初期化済み判定");
        this._pixstock.initialize(parent.getIpc(), false, this._logger); // IPCオブジェクト取得
        this.courierService.initialize();
        this.deliveryService.initialize();
        this.naviService.initialize();
      }
    }
  }
}
