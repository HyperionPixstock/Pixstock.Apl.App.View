import { Category } from '../../shared/model/category';
import { CategoryDao } from '../../shared/dao/category.dao';
import { Component, NgZone, ViewChild } from '@angular/core';
import { Content } from '../../shared/model/content';
import { ContentPageBase } from '../../shared/pages/ContentPageBase';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import { NavController, NavParams, PopoverController, List } from 'ionic-angular';
import { LabelDao, ResultFindLabelLinkCategory } from '../../shared/dao/label.dao';
import { ViewModel, ThumbnailListPageItem, ContentListPageItem } from '../../shared/service/viewmodel';
import { IpcUpdatePropResponse } from '../../shared/service/response/IpcUpdateProp.response';
import { MessagingHelper } from '../../shared/service/messaging.helper';

/**
 * サムネイル一覧画面コンポーネント
 */
@Component({
  selector: 'page-thumbnail-list',
  templateUrl: 'thumbnail-list.html'
})
export class ThumbnailListPage extends ContentPageBase {
  @ViewChild(List) list: List;

  mActiveLoadingCategory: boolean = false;

  /**
   *
   */
  mCategoryId: number | null = null;

  mRule: string = null;

  /**
   * 画面の初期化が完了しているかどうかのフラグ
   *
   * ナビゲーションの戻るで、この画面に遷移した場合は初期化を行わないようにする。
   */
  mInitializeCompletedFlag: boolean = true;

  /**
   * リストアイテムの遅延読み込みで、一度に読み込むアイテム数
   *
   * リストの初期化時に読み込んだアイテム数を、
   * 遅延読み込み時の読み込み数とする。
   */
  mAdjustLazyLoadNum: number = 0;


  /**
   * UpdatePropイベントの購読オブジェクト
   */
  mSubscribeUpdateProp: any;

  /**
   * NotificationContentListPageItemイベントの購読オブジェクト
   */
  mSubscribeNotificationContentListPageItem: any;

  /**
   * 最後にCategoryListプロパティを取得したときのカテゴリ一覧リストの項目数
   */
  mLastSubscribeUpdateProp_CategoryListNum: number = 0;

  /**
   * 現在の条件ですべてのカテゴリ情報を取得したと判断したか示すフラグ
   */
  mContinueLoadFlag: boolean = true;

  /**
   * コンテント一覧の読み込み完了時に、
   * 前回表示していたコンテントのプレビュー画面を表示するかどうか示すフラグ
   */
  mShowContinueContentPreviewJustPropLoaded: boolean = false;

  /**
   * 前回表示していたコンテントのキー
   */
  mNextDisplayContentId: number | null = null;

  /**
   * コンストラクタ
   *
   * @param navCtrl
   * @param navParams
   * @param _logger
   * @param _pixstock
   * @param _ngZone
   * @param popoverCtrl
   */
  constructor(protected navCtrl: NavController
    , protected navParams: NavParams
    , protected _logger: Logger
    , protected _pixstock: MessagingService
    , protected _ngZone: NgZone
    , protected popoverCtrl: PopoverController
    , protected categoryDao: CategoryDao
    , protected labelDao: LabelDao
    , protected vm: ViewModel // 直接VMを、Htmlから呼び出します
  ) {
    super(_logger, _ngZone, popoverCtrl, _pixstock);
  }

  ngOnInit() {
    this._logger.debug("[ThumbnailListPage][ngOnInit]");
    this.mSubscribeUpdateProp = this._pixstock.UpdateProp.subscribe((prop: IpcUpdatePropResponse) => {
      if (prop.PropertyName == "CategoryList") {

        // 前回の読み込みからリスト内の要素数に変化がない場合は、
        // すべての項目を読み込んだと判断し、以降の読み込みを停止する。
        if (this.mLastSubscribeUpdateProp_CategoryListNum == this.vm.ThumbnailListPageItem.length) {
          this.mActiveLoadingCategory = false;
          this.mContinueLoadFlag = false;
          return;
        }

        this.mLastSubscribeUpdateProp_CategoryListNum = this.vm.ThumbnailListPageItem.length;

        // 表示領域からはみ出す分のアイテムを作成するまで、初回の呼び出しを繰り返す。
        // setTimeoutを使って画面の再描画を行わないと、アイテム追加後の高さが正常に取得できない
        let dimention = this.content.getContentDimensions();
        var element = this.list.getNativeElement();
        if (element.offsetHeight < dimention.contentHeight) {
          setTimeout(() => {
            this.requestUpdateCategoryList();
          }, 10);
        } else {
          this.mActiveLoadingCategory = false;
        }
      }
    });

    this.mSubscribeNotificationContentListPageItem = this.vm.NotificationContentListPageItem.subscribe((value: ContentListPageItem[]) => {
      this._logger.debug("[ThumbnailListPage][NotificationContentListPageItem] subscribe");
      if (!this.mShowContinueContentPreviewJustPropLoaded) return;

      setTimeout(() => {
        this._logger.debug("[ThumbnailListPage][NotificationContentListPageItem] mNextDisplayContentId=", this.mNextDisplayContentId);

        // 前回表示していたコンテントの場所を、コンテント配列から検索する
        let contentIndex: number = value.findIndex((element, index, array) => {
          if (element.Content.Id == this.mNextDisplayContentId) return true;
          return false;
        });

        if (contentIndex != -1) {
          this._logger.debug("[ThumbnailListPage][NotificationContentListPageItem] コンテント一覧の途中から表示を開始します 表示要素位置=", contentIndex);
          this.showPreviewPage(contentIndex);
        }
      }, 10);
    });

    this.vm.ThumbnailListPageItem = [];
    this.vm.ContentListPageItem = [];
  }

  ngOnDestroy() {
    this.mSubscribeUpdateProp.unsubscribe();
    this.mSubscribeNotificationContentListPageItem.unsubscribe();
  }

  ionViewDidLoad() {
    super.ionViewDidLoad();
    this._logger.debug("[ThumbnailListPage][ionViewDidLoad]", this.navParams.data);

    this.mContinueLoadFlag = true;
    this.mCategoryId = 1;
    this.requestUpdateCategoryList();
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
  }

  /**
   * @inheritDoc
   */
  OnWindowResize() {
  }

  /**
   * カテゴリ一覧リストのスクロールDOMイベントのハンドラ
   *
   * @param event DOMイベント
   */
  onCategoryListScroll(event): void {
    var element = this.list.getNativeElement();
    if (this.mCategoryId != null) {

      // スクロール末尾を表示しているか判定し、
      // 表示位置が末尾の場合は、続きのデータ読み込み処理を呼び出す。
      var diff = event.srcElement.offsetHeight + event.srcElement.scrollTop;
      if (diff > element.offsetHeight && !this.mActiveLoadingCategory && this.mContinueLoadFlag) {
        this.mActiveLoadingCategory = true;
        this.requestUpdateCategoryList();
      }
    }
  }

  /**
   * コンテント一覧リスト内でのアイテムクリックイベントのハンドラ
   *
   * @param item クリックされたアイテム(Itemsプロパティ内の要素)
   * @param index クリックされたアイテムの、リスト内の位置。
   */
  onClick_ContentItemContainer(item: Content, index: number): void {
    this._logger.debug("[ThumbnailListPage][onClick_ContentItemContainer]", item);
    this.showPreviewPage(index);
  }

  /**
   * カテゴリ一覧リスト内でのアイテムクリックイベントのハンドラ
   *
   * @param item 子階層のカテゴリ一覧リストを表示したいカテゴリ情報(親カテゴリ)
   */
  onClick_CategoryItemContainer(item: Category): void {
    this._logger.debug("[ThumbnailListPage][onClick_CategoryItemContainer]", item);
    this.vm.ThumbnailListPageItem = [];
    this.mContinueLoadFlag = true;
    this.mCategoryId = item.Id;
    this.requestUpdateCategoryList();
  }

  /**
   * カテゴリのコンテントリスト表示ボタンのクリックイベントハンドラ
   *
   * @param item 選択したカテゴリ情報
   */
  onClick_CategoryContentItem(item: ThumbnailListPageItem): void {
    this._logger.debug("[ThumbnailListPage][onClick_CategoryContentItem]");
    this.toggleSelectedItem(item);

    this.mShowContinueContentPreviewJustPropLoaded = false;
    MessagingHelper.GETCATEGORYCONTENT(this._pixstock, item.Category.Id);
  }

  /**
   * 続きからコンテントをプレビュー画面で表示する
   *
   * @param item 続きから表示するカテゴリ一覧リスト内の項目
   */
  onClick_CategoryContentItemContinue(item: ThumbnailListPageItem): void {
    // GETCATEGORYCONTENTを実行し、カテゴリのコンテント一覧をBFFから取得する
    // 取得後、ThumbnailListPageItem.Category.NextDisplayContentIdに一致するコンテントをプレビュー画面で表示する。

    this._logger.debug("[ThumbnailListPage][onClick_CategoryContentItemContinue] NextDisplayContentId=", item.Category.NextDisplayContentId);
    this.toggleSelectedItem(item);

    this.mNextDisplayContentId = item.Category.NextDisplayContentId;

    this.mShowContinueContentPreviewJustPropLoaded = true;
    MessagingHelper.GETCATEGORYCONTENT(this._pixstock, item.Category.Id);
  }

  /**
   * カテゴリ一覧リストの任意アイテムのみ選択状態に設定し、
   * それ以外のアイテムは非選択状態に設定する
   *
   * @param item 選択状態にするアイテム
   */
  private toggleSelectedItem(item: ThumbnailListPageItem) {
    this.vm.ThumbnailListPageItem.forEach(prop => {
      if (prop != item) prop.Selected = false;
      else prop.Selected = true;
    });
  }

  /**
   * プレビュー画面遷移メッセージを送信する
   *
   * @param contentIndex 表示するコンテント情報のコンテント配列内での位置
   */
  private showPreviewPage(contentIndex: number) {
    // 遷移先の画面には、表示するコンテントのリスト内での位置を渡す。
    MessagingHelper.TRNS_PreviewPage(this._pixstock, contentIndex);
  }

  /**
   * 任意のルールを条件に、カテゴリ一覧を表示する（未実装）
   */
  private showCategoryByRule() {
    this._logger.debug("[ThumbnailListPage.showCategoryByRule][IN]");

    var callback = (result: ResultFindLabelLinkCategory) => {
      result.Categories.forEach(category => {
        this.AddThumbnailListPageItem(category);
      });
    };

    this.labelDao.findLabelLinkCategory(this.mRule)
      .subscribe((result) => {
        callback(result)
      });
  }

  /**
   * 現在のルールに一致するカテゴリ情報リストをBFFから取得する
   */
  private requestUpdateCategoryList() {
    // 前回までの読み込み位置を管理し、処理を呼び出す際にリスト内の読み込み位置（オフセット）を指定する。
    var offsetSubCategory = 0;
    if (this.vm.ThumbnailListPageItem != null)
      offsetSubCategory = this.vm.ThumbnailListPageItem.length;

    MessagingHelper.GETCATEGORY(this._pixstock, this.mCategoryId, offsetSubCategory);
  }

  /**
   * 未実装
   * @param category
   */
  private AddThumbnailListPageItem(category: Category) {
    // let listitem = new ThumbnailListPageItem();
    // listitem.Category = category;

    // if (category.HasLinkSubCategoryFlag) {
    //   listitem.IsSubCaetgory = true;
    // }
    // listitem.IsContent = true;

    // this.mItems.push(listitem);
  }
}

