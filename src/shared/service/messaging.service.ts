import { Injectable, EventEmitter } from '@angular/core';
import { Logger } from "angular2-logger/core";
import { IpcUpdateViewResponse } from './response/IpcUpdateView.response';
import { IpcResponse } from './response/ipc.response';
import { IpcUpdatePropResponse } from './response/IpcUpdateProp.response';

@Injectable()
export class MessagingService {
  /**
   * ElectronNETのRendererで使用するIPCオブジェクト
   */
  ipcRenderer: any;

  /**
   * ロガー
   */
  logger: Logger;

  echo: EventEmitter<string> = new EventEmitter();
  ShowContentPreview: EventEmitter<string> = new EventEmitter();
  ShowContentList: EventEmitter<string> = new EventEmitter();
  UpdateView: EventEmitter<IpcUpdateViewResponse> = new EventEmitter(); // 新API
  UpdateProp: EventEmitter<IpcUpdatePropResponse> = new EventEmitter(); // 新API

  /**
   * サービスの初期化
   *
   * @param ipcRenderer IPCオブジェクト
   * @param isRpcInitialize IPCオブジェクトのイベントハンドラ登録を行うかどうかのフラグ
   */
  initialize(_ipcRenderer: any, _isRpcInitialize: boolean, _logger: Logger) {
    this.ipcRenderer = _ipcRenderer;
    this.logger = _logger;

    if (!window['angularComponentRef_PixstockNetService']) {
      window['angularComponentRef_PixstockNetService'] = {
        // NOTE: IPCイベントをすべて登録する
        componentFn_MSG_SHOW_CONTENTPREVIEW: (event, arg) => this.onMSG_SHOW_CONTENTPREVIEW(event, arg),
        componentFn_MSG_SHOW_CONTENLIST: (event, arg) => this.onMSG_SHOW_CONTENLIST(event, arg),
        componentFn_IPC_UPDATEVIEW: (event, arg) => this.onIPC_UPDATEVIEW(event, arg),
        componentFn_IPC_UPDATEPROP: (event, arg) => this.onIPC_UPDATEPROP(event, arg)
      };
    }

    if (_isRpcInitialize) {
      _logger.info("IPCイベントの初期化");

      this.ipcRenderer.removeAllListeners(["MSG_SHOW_CONTENTPREVIEW", "MSG_SHOW_CONTENLIST"]);

      this.ipcRenderer.on('MSG_SHOW_CONTENTPREVIEW', (event, arg) => {
        var ntv_window: any = window;
        ntv_window.angularComponentRef.zone.run(() => {
          ntv_window.angularComponentRef_PixstockNetService.componentFn_MSG_SHOW_CONTENTPREVIEW(event, arg);
        });
      });

      this.ipcRenderer.on('MSG_SHOW_CONTENLIST', (event, arg) => {
        var ntv_window: any = window;
        ntv_window.angularComponentRef.zone.run(() => {
          ntv_window.angularComponentRef_PixstockNetService.componentFn_MSG_SHOW_CONTENLIST(event, arg);
        });
      });

      // IPC_UPDATEVIEWメッセージ
      this.ipcRenderer.on('IPC_UPDATEVIEW', (event, arg) => {
        var ntv_window: any = window;
        ntv_window.angularComponentRef.zone.run(() => {
          ntv_window.angularComponentRef_PixstockNetService.componentFn_IPC_UPDATEVIEW(event, arg);
        });
      });

      // IPC_UPDATEPROPメッセージ
      this.ipcRenderer.on('IPC_UPDATEPROP', (event, arg) => {
        var ntv_window: any = window;
        ntv_window.angularComponentRef.zone.run(() => {
          ntv_window.angularComponentRef_PixstockNetService.componentFn_IPC_UPDATEPROP(event, arg);
        });
      });
    }
  }

  private onMSG_SHOW_CONTENTPREVIEW(event, args) {
    this.logger.debug("[PixstockNetService][onMSG_SHOW_CONTENTPREVIEW] : Execute");
    //this.ShowContentPreview.emit(args);
  }

  private onMSG_SHOW_CONTENLIST(event, args) {
    this.logger.debug("[PixstockNetService][onMSG_SHOW_CONTENLIST] : Execute");
    //this.ShowContentList.emit(args);
  }

  private onIPC_UPDATEVIEW(event, args: IpcResponse) {
    this.logger.debug("[PixstockNetService][onIPC_UPDATEVIEW] : Execute", args);

    // "IPC_UPDATEVIEW"メッセージの、本文をインスタンス化する。
    var responseObj = JSON.parse(args.body) as IpcUpdateViewResponse;

    // DUMP --------
    this.logger.debug(responseObj);
    responseObj.UpdateList.forEach(element => {
      this.logger.debug("[UpdateList] ", element);
    });
    this.logger.debug("[Parameter] ", responseObj.Parameter);
    // -------------

    this.UpdateView.emit(responseObj);
  }

  private onIPC_UPDATEPROP(event, args: IpcResponse) {
    this.logger.debug("[PixstockNetService][onIPC_UPDATEPROP] : Execute", args);

    // "IPC_UPDATEPROP"メッセージの、本文をインスタンス化する。
    var responseObj = JSON.parse(args.body) as IpcUpdatePropResponse;

    // DUMP
    this.logger.debug(responseObj);

    this.UpdateProp.emit(responseObj);
  }
}
