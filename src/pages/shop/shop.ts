import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ShopProvider } from '../../providers/shop/shop';
import { APP_SERVE_URL } from '../../providers/config';
import { GoodsPage } from '../goods/goods';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  hostsURL: string = APP_SERVE_URL;

  shopData: any;
  isQuery: boolean;

  goodsRoot = GoodsPage;
  ratingRoot = 'RatingPage';
  sellerRoot = 'SellerPage';
  ratings = "评价(1234)";
  shopParams: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private shopPvd: ShopProvider) {
    this.shopParams = {
      sellerid: navParams.get('sellerid'),
    };
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  //更新显示
  refreshDisplay() {
    this.shopPvd.getOneShopData(this.navParams.get('sellerid'))
      .subscribe(
        (res) => {
          if (res == false) {
            this.isQuery = false;
          }
          else {
            this.shopData = res;
          }
        },
        (err) => {
          console.log('shop-getOneShopData-err', err);
        });

  }

}
