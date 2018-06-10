import { Component } from '@angular/core';
import { App, ViewController, NavController, NavParams } from 'ionic-angular';
import { ShopServiceProvider } from '../../providers/shop-service/shop-service';

import { ShopPage } from '../shop/shop';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hostsURL: string = 'http://120.78.220.83:22781/';

  allShopData: any;

  isQuery: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public appCtrl: App,
              public shopSvc: ShopServiceProvider,
              ) {

  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }
  //页面加载
  refreshDisplay() {
    //获得所有商家店铺数据
    this.shopSvc.getAllShopData().subscribe((res) => {
      this.isQuery = res.querySuccess;
      if (res.querySuccess) {
        this.allShopData = res.queryResult;
        console.log("allShopData",this.allShopData);
      }//登录失败
      else {
        this.isQuery = false;
      }
    }, (err) => {
      console.log("我日我求你别错了!");
    });
  }

  pushOneShop(ID) {
    this.appCtrl.getRootNav().push(ShopPage, {sellerid: ID,});
  }

}
