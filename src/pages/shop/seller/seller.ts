import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { ShopProvider } from '../../../providers/shop/shop';
import { NativeProvider } from '../../../providers/native/native';

@IonicPage()
@Component({
  selector: 'page-seller',
  templateUrl: 'seller.html',
})
export class SellerPage {

  seller: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {
      console.log("data:", navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerPage');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }



  //加载页面
  refreshDisplay() {
    this.seller = this.navParams.get('seller');
  }

}
