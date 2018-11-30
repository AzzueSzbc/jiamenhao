import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { StorageProvider } from '../../providers/storage/storage';
import { OrderProvider } from '../../providers/order/order';
import { WechatProvider } from '../../providers/wechat/wechat';

declare let cordova;

@IonicPage()
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html',
})
export class PaymentMethodPage {

  pantment:string = 'weixinpay';
  orderID;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private orderPvd: OrderProvider,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    private wechat: WechatProvider,
    ) {
      this.orderID = navParams.get('orderID');
      console.log("orderID:", this.orderID);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentMethodPage');
  }

  pay() {
    if (this.pantment == 'alipay') {
      this.alipay();
    } else if (this.pantment == 'weixinpay') {
      this.weixinpay();
    }
  }

  //使用支付宝支付
  alipay() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.orderPvd.payPurchaseOrderByAlipay(buyer.userID, buyer.token, this.orderID).subscribe(
          (payInfo) => {
            //alert("payInfo:"+ JSON.stringify(payInfo));
            console.log("payInfo:"+ payInfo);
            if (payInfo) {
              //调用支付宝进行支付
              cordova.plugins.alipay.payment(payInfo, (success) => {
                // Success
                this.nativePvd.presentSimpleToast("支付成功");
                //打开订单页面
                this.pushOrderPage(this.orderID);
              }, (error) => {
                // Failed
                this.nativePvd.presentSimpleToast("支付失败");
                //打开订单页面
                this.pushOrderPage(this.orderID);
              });
            } else {
              this.nativePvd.presentSimpleAlert("支付出错");
              //打开订单页面
              this.pushOrderPage(this.orderID);
            }
          }, (err) => {
            this.nativePvd.presentSimpleAlert("支付出错");
            //console.log("PayPage-submitOrder-payOrder-err", err);
            //打开订单页面
            this.pushOrderPage(this.orderID);
          });
      } else {
        //没有token未登录
        this.nativePvd.presentSimpleAlert("用户身份验证未通过，请重新登录");
        //打开订单页面
        this.pushOrderPage(this.orderID);
      }
    });
  }

  //使用微信支付
  weixinpay() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.orderPvd.payPurchaseOrderByWeChat(buyer.userID, buyer.token, this.orderID).subscribe(
          (payInfo) => {
            //alert("payInfo:"+ JSON.stringify(payInfo));
            console.log("payInfo:", payInfo);
            this.wechat.pay(payInfo, () => {
              // Success
              this.nativePvd.presentSimpleToast("支付成功");
              //打开订单页面
              this.pushOrderPage(this.orderID);
            }, () => {
              // Failed
              this.nativePvd.presentSimpleToast("支付失败");
              //打开订单页面
              this.pushOrderPage(this.orderID);
            });
          }, (err) => {
            this.nativePvd.presentSimpleAlert("支付出错");
            //console.log("PayPage-submitOrder-payOrder-err", err);
            //打开订单页面
            this.pushOrderPage(this.orderID);
          });
      } else {
        //没有token未登录
        this.nativePvd.presentSimpleAlert("用户身份验证未通过，请重新登录");
        //打开订单页面
        this.pushOrderPage(this.orderID);
      }
    });
  }

  //打开订单页面
  pushOrderPage(orderID) {
    this.appCtrl.getRootNav().push('OrderPage', {
      orderID: orderID
    });
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
