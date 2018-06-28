import { Component } from '@angular/core';
import { App, ViewController, NavController, NavParams } from 'ionic-angular';
import { ShopProvider } from '../../providers/shop/shop';
import { APP_SERVE_URL } from '../../providers/config';

import { ShopPage } from '../shop/shop';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hostsURL: string = APP_SERVE_URL;

  allShopData: any;

  isQuery: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appCtrl: App,
    private shopPvd: ShopProvider) { }

  ionViewWillEnter() {
    this.refreshDisplay();
  }
  //页面加载
  refreshDisplay() {
    //获得所有商家店铺数据
    this.shopPvd.getAllShopData()
      .subscribe(
        (res) => {
          if (res == false) {
            this.isQuery = false;
          }
          else if (res) {
            this.isQuery = true;
            this.allShopData = res;
            console.log("allShopData", this.allShopData);
          }
        },
        (err) => {
          console.log('home-getallshop-err', err);
        });
  }

  pushOneShop(ID) {
    this.appCtrl.getRootNav().push(ShopPage, { sellerid: ID, });
  }

}
