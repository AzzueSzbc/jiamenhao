import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { APP_SERVE_URL } from '../../providers/config';

@IonicPage()
@Component({
  selector: 'page-seller',
  templateUrl: 'seller.html',
})
export class SellerPage {

  hostsURL: string = APP_SERVE_URL;

  sellerData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.sellerData = this.navParams.get('sellerdata');
    console.log('seller-sellerData', this.sellerData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerPage');
  }

}
