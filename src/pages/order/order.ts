import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { OrderProvider } from '../../providers/order/order';
import { APP_SERVE_URL } from '../../providers/config';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  orderID: string;

  orderData: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativePvd: NativeProvider,
    private orderPvd: OrderProvider) {
  }

  ionViewWillLoad() {
    this.orderID = this.navParams.get('orderid');
    console.log('order-orderID', this.orderID);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    this.refreshDisplay();
  }

  refreshDisplay() {
    this.nativePvd.getStorage('clientid').then((id) => {
      this.nativePvd.getStorage('clienttoken').then((token) => {
        if (token) {
          this.orderPvd.getOneOrder({
            buyerID: id,
            buyerToken: token,
            ordersID: this.orderID
          })
            .subscribe(
              (res) => {
                if (res == false) {
                } else if (res == null) {
                } else if (res) {
                  this.orderData = res;
                  console.log('order-getOneOrder-res', res);
                }
              },
              (err) => {
                console.log('order-getOneOrder-err', err);
              }
            );
        }
      });
    });
  }
}
