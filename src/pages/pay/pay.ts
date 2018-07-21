import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { APP_SERVE_URL } from '../../providers/config';

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

  hostsURL: string = APP_SERVE_URL;
  buyerID: string;
  buyerToken: string;
  sellerID: string;

  cartList: any[];
  orderProduct: any[];
  shippingCharge: number = 0;
  packCharge: number = 0;
  note: string = "aa";
  ActualPayment: number;

  addressData: any;
  isSelectOneAddress: boolean = false;
  paySum: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private orderPvd: OrderProvider,
    private userPvd: UserProvider,
    private nativePvd: NativeProvider) {
    this.sellerID = navParams.get('sellerid');
    console.log("sellerID", this.sellerID);
    this.nativePvd.getStorage('cartlist:' + this.sellerID).then((list) => {
      this.cartList = list;
      console.log('cartlist:' + this.sellerID + ':', this.cartList);
      this.cartList.forEach((g) => {
        this.paySum += g.ordersProductPrice * g.ordersProductAmount;
      });
      this.shippingCharge = parseInt(navParams.get('shippingcharge'));
      console.log('shippingCharge', this.shippingCharge, "paySum", this.paySum, "packCharge", this.packCharge);
      this.ActualPayment = this.shippingCharge + this.paySum + this.packCharge;
      console.log("ActualPayment", this.ActualPayment);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayPage');
  }

  ionViewWillEnter() {
    this.getPreselectionAddress();
  }

  getPreselectionAddress() {
    this.nativePvd.getStorage('clientid').then((id) => {
      this.buyerID = id;
      this.nativePvd.getStorage('clienttoken').then((token) => {
        this.buyerToken = token;
        this.nativePvd.getStorage('addressid').then((address) => {
          if (address) {
            this.userPvd.getOneShippingAddress({
              buyerID: id,
              buyerToken: token,
              buyerShippingAddressID: address
            })
              .subscribe(
                (res) => {
                  console.log('pay-getPreselectionAddress-res', res);
                  if (res == false) {
                    this.isSelectOneAddress = false;
                  }
                  else {
                    this.isSelectOneAddress = true;
                    console.log('pay-getPreselectionAddress', res);
                    this.addressData = res;
                  }
                },
                (err) => {
                  console.log('pay-getPreselectionAddress-err', err);
                });
          }
        });
      });
    });
  }

  pushChooesAddressPage() {
    this.navCtrl.push('ChooseAddressPage');
  }

  submitOrder() {
    console.log('post', {
      buyerID: this.buyerID,
      buyerToken: this.buyerToken,
      sellerID: this.sellerID,
      ordersShippingCharge: this.shippingCharge,
      ordersPackCharge: this.packCharge,
      ordersNote: this.note,
      consigneeName: this.addressData.consigneeName,
      consigneeGender: this.addressData.consigneeGender,
      consigneePhoneNumber: this.addressData.consigneePhoneNumber,
      consigneeAddress: this.addressData.consigneeAddress,
      ordersActualPayment: this.ActualPayment,
      ordersProduct: this.cartList,
    });
    this.orderPvd.submitOrderData({
      buyerID: this.buyerID,
      buyerToken: this.buyerToken,
      sellerID: this.sellerID,
      ordersShippingCharge: this.shippingCharge,
      ordersPackCharge: this.packCharge,
      ordersNote: this.note,
      consigneeName: this.addressData.consigneeName,
      consigneeGender: this.addressData.consigneeGender,
      consigneePhoneNumber: this.addressData.consigneePhoneNumber,
      consigneeAddress: this.addressData.consigneeAddress,
      ordersActualPayment: this.ActualPayment,
      ordersProduct: this.cartList,
    })
      .subscribe(
        (res) => {
          if (res != false) {
            this.navCtrl.push('OrderPage', {
              orderid: res.ordersID
            });
            this.nativePvd.removeStorage('cartlist:'+this.sellerID);
          }
        },
        (err) => {
          console.log('pay-submitOrder-err', err);
        });
  }

}
