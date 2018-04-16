import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

  public hostsURL: string = 'http://144.202.120.126:888/';

  cartList: any[];
  shippingCharge:  any;
  paySum: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public http: Http, private storage: Storage,) {

    this.storage.get('cartlist').then((val) => {
      this.cartList = val;
      this.cartList.forEach((g) => {
        this.paySum += g.goodsPrice * g.goodsNumber;
      });
    });
    this.shippingCharge = navParams.get('shippingCharge');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayPage');
    this.storage.get('hi').then((val) => {
      console.log(val);
    });
  }

}
