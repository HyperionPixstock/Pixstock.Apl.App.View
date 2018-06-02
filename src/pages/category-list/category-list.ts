import { Component } from "@angular/core";
import { Category } from "../../shared/model/category";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "angular2-logger/core";
import { MessagingService } from "../../shared/service/messaging.service";

@Component({
    selector: 'page-category-list',
    templateUrl: 'category-list.html'
})
export class CategoryListPage {
    Items: Array<{ Category: Category }>

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public _logger: Logger,
        public _pixstock: MessagingService) {

    }
}
