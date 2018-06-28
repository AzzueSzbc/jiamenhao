import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import { OrderProvider } from '../../providers/order/order';
import { NativeProvider } from '../../providers/native/native';
import { APP_SERVE_URL } from '../../providers/config';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  hostsURL: string = APP_SERVE_URL;

  listData: any;

  islogined: boolean;

  constructor(public navCtrl: NavController,
    public appCtrl: App,
    private nativePvd: NativeProvider,
    private orderPvd: OrderProvider) {}

  ionViewWillEnter() {
    this.refreshDisplay();
  }
  //更新显示
  refreshDisplay() {
    this.nativePvd.getStorage('clientid').then((id) => {
      this.nativePvd.getStorage('clienttoken').then((token) => {
        if (token) {
          this.orderPvd.getAllOrder({
            buyerID: id,
            buyerToken: token,
          })
          .subscribe(
            (res) => {
              if (res == false) {
                this.islogined = false;
              }
              else {
                this.islogined = true;
                this.listData = res;
              }
            },
            (err) => {
              console.log('list-getAllOrder-err', err);
            }
          );
        }
        else this.islogined = false;
      });
    });
  }

}
