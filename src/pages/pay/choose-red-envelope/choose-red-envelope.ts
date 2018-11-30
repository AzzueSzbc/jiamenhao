import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { NativeProvider } from '../../../providers/native/native';
import { StorageProvider } from '../../../providers/storage/storage';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-choose-red-envelope',
  templateUrl: 'choose-red-envelope.html',
})
export class ChooseRedEnvelopePage {

  isLogined: boolean = false;
  productTotalPrice: number = 0;

  usableCoupons: any[];
  unusableCoupons: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private statusBar: StatusBar,
    private userPvd: UserProvider,
    private storagePvd: StorageProvider) {
      this.productTotalPrice = navParams.get('productTotalPrice');
      console.log("ChooseRedEnvelopePage constructor productTotalPrice:", this.productTotalPrice);
  }

  ionViewDidLoad() {
    this.refreshDisplay();
    console.log('ionViewDidLoad ChooseRedEnvelopePage');
  }

  refreshDisplay() {
    this.usableCoupons = [];
    this.unusableCoupons = [];
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.userPvd.getCoupon(buyer.userID,buyer.token)
        .subscribe(
          (res) => {
            console.log("ChooseRedEnvelopePage refreshDisplay getCoupon res:", res);
            if (res == false) {
              this.isLogined = false;
            }
            else {
              this.isLogined = true;
              let coupons = res;

              coupons.forEach((coupon) => {
                if (coupon.couponStatus=="未使用") {
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
                    if (this.productTotalPrice < coupon.minMoneyLimit) {
                      coupon.unusableReason.push("商品金额不满足使用要求");
                    }
                    this.unusableCoupons.push(coupon);
                  } else if (this.productTotalPrice < coupon.minMoneyLimit) {
                    coupon.isUsable = false;
                    coupon.unusableReason.push("商品金额不满足使用要求");
                    this.unusableCoupons.push(coupon);
                  } else {
                    this.usableCoupons.push(coupon);
                  }
                }
              });
              console.log("ChooseAddressPage refreshDisplay getCoupon coupons:", coupons);
              console.log("ChooseAddressPage refreshDisplay getCoupon usableCoupons:", this.usableCoupons);
              console.log("ChooseAddressPage refreshDisplay getCoupon unusableCoupons:", this.unusableCoupons);
            }
          },
          (err) => {
            console.log('user-getCoupon-err', err);
          }
        );
      }
      else this.isLogined = false;
    });
  }

  chooseRedEnvelope(coupon) {
    this.viewCtrl.dismiss(coupon);
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
