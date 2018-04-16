import { Component } from '@angular/core';
import { App, ViewController, NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';

import { ShopPage } from '../shop/shop';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public hostsURL: string = 'http://144.202.120.126:888/';

  displayUsingURL: string = 'forBuyerGetAllSeller_simplified.php';

  nothing: string;
  respData: any;

  allShopData: any;

  isQuery: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public appCtrl: App,
              public http: Http,
              ) {

  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  refreshDisplay() {
    var link = this.hostsURL + this.displayUsingURL;
    var myData = JSON.stringify({ nothing: this.nothing });
    this.http.post(link, myData)
      .subscribe((res: Response) => {
        this.respData = res.json();
        console.log('disRespData:', this.respData);
        this.isQuery = this.respData.querySuccess;
        if (this.respData.querySuccess) {
          console.log('disRespData length:', this.respData.queryResult.length);
          this.allShopData = this.respData.queryResult;
        }//登录失败
        else {
          console.log("querySuccess-false");
          this.isQuery = false;
        }
      }, error => {
        console.log("我日我求你别错了!");
      });
  }

  pushOneShop(ID) {
    this.appCtrl.getRootNav().push(ShopPage, {sellerid: ID,});
  }

}
