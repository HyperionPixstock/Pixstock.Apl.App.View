import { Component } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../shared/service/messaging.service';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private _logger: Logger,
    private _pixstock: MessagingService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      setTimeout(() => {
        splashScreen.hide();
      }, 1000);
    });

    this._pixstock.echo.subscribe(prop => this.onEcho(prop));
    this._pixstock.ShowContentPreview.subscribe(prop => this.OnShowContentPreview(prop));
    this._pixstock.ShowContentList.subscribe(prop => this.OnShowContentList(prop));
  }

  onEcho(todo: string) {
    console.info("イベントから取得したメッセージ=" + todo);
  }

  OnShowContentPreview(args: Number) {
    this._logger.info("[Stella][AppComponent][OnShowContentPreview] : イベントから取得したメッセージ=" + args);
  }

  OnShowContentList(args: Number) {
    this._logger.info("[Stella][AppComponent][OnShowContentList] : イベントから取得したメッセージ=" + args);
  }
}

