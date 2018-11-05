import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { NativeProvider } from '../../../providers/native/native';
import { UserProvider } from '../../../providers/user/user';

import { PICTURE_WAREHOUSE_URL } from '../../../providers/config';

@IonicPage()
@Component({
  selector: 'page-red-envelope',
  templateUrl: 'red-envelope.html',
})
export class RedEnvelopePage {

  isLogined: boolean = false;

  Coupons: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private statusBar: StatusBar,
    private userPvd: UserProvider,
    private nativePvd: NativeProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RedEnvelopePage');
    this.refreshDisplay();
  }

  //更新显示
  refreshDisplay() {
    this.nativePvd.getStorage('clientid').then((id) => {
      this.nativePvd.getStorage('clienttoken').then((token) => {
        if (token) {
          this.userPvd.getCoupon({
            buyerID: id,
            buyerToken: token,
          })
          .subscribe(
            (res) => {
              console.log("UserPage-refreshDisplay-getCoupon-res:", res);
              if (res == false) {
                this.isLogined = false;
              }
              else {
                this.isLogined = true;
                this.Coupons = res;
                this.Coupons.forEach((coupon) => {
                  let date = new Date();
                  date.setTime((coupon.expiryDate * 1000));
                  coupon['displayExpiryDate'] = date.toLocaleString();
                  coupon['isUsable'] = true;
                  coupon['unusableReason'] = [];
                  let now = date.getTime();
                  if(now > coupon.expiryDate*1000){
                    //过期
                    //注：getTime()获得毫秒数，需将expiryDate*1000再与当前时间比较，判断是否过期
                    coupon.isUsable = false;
                    coupon.unusableReason.push("超过使用期限");
                    if (coupon) {

                    }
                  }
                });
                console.log("UserPage-refreshDisplay-getCoupon-Coupons:", this.Coupons);
              }
            },
            (err) => {
              console.log('user-getCoupon-err', err);
            }
          );
        }
        else this.isLogined = false;
      });
    });
  }

}
