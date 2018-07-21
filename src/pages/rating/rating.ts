import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { ShopProvider } from '../../providers/shop/shop';
import { APP_SERVE_URL } from '../../providers/config';

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {

  hostsURL: string = APP_SERVE_URL;

  ratingData: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {
  }

  ionViewWillEnter() {
    this.shopPvd.getAllSellerComment(this.navParams.get('seller'))
    .subscribe(
      (res) => {
        if (res != null || res != false) {
          this.ratingData = res;
          console.log('getAllSellerComment-res', res);
        }
      },
      (err) => {
        console.log('rating-getAllSellerComment', err);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

}
