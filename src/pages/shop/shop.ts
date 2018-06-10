import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ShopServiceProvider } from '../../providers/shop-service/shop-service';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  hostsURL: string = 'http://120.78.220.83:22781/';
  sellerID: string;

  shopData: any;
  isQuery: boolean;

  goodsRoot = 'GoodsPage';
  ratingRoot = 'RatingPage';
  sellerRoot = 'SellerPage';
  ratings = "评价(1234)";
  shopParams: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public shopSvc: ShopServiceProvider,) {

    this.sellerID = navParams.get('sellerid');
    this.shopParams = {
      sellerid: this.sellerID,
    };
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  //更新显示
  refreshDisplay() {
    this.shopSvc.getOneShopData(this.sellerID).subscribe((res) => {
      this.isQuery = res.querySuccess;
      if (res.querySuccess) {
        this.shopData = res.queryResult[0];
      }
      else {
        console.log("querySuccess-false");
        this.isQuery = false;
      }
    }, (err) => {
      console.log("我日我求你别错了!");
    });

  }

}
