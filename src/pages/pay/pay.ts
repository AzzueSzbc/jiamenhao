import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { OrderServiceProvider } from '../../providers/order-service/order-service'

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

  activeNav: any;

  hostsURL: string = 'http://120.78.220.83:22781/';
  myID: string;
  myToken: string;
  sellerID: string;

  cartList: any[];
  orderProduct: any[];
  shippingCharge: any;
  packCharge: number = 2;
  note: string = "aa";

  addressData: any;
  isSelectOneAddress: boolean = false;
  paySum: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public orderSvc: OrderServiceProvider,
    private storage: Storage,
    public appCtrl: App) {

    this.storage.get('cartlist').then((val) => {
      this.cartList = val;
      this.cartList.forEach((g) => {
        this.paySum += g.ordersProductPrice * g.ordersProductAmount;
      });
    });

    this.shippingCharge = navParams.get('shippingCharge');
    this.sellerID = navParams.get('sellerID');
    console.log("sellerID", this.sellerID);
  }

  ionViewWillEnter() {
    this.getPreselectionAddress();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayPage');
  }

  getPreselectionAddress() {
    this.storage.get('clientid').then((val) => { this.myID = val });
    this.storage.get('clienttoken').then((val) => { this.myToken = val });
    this.storage.get('addressid').then((val) => {
      if (val) {
        this.orderSvc.getOneShippingAddress({
          buyerID: this.myID,
          buyerToken: this.myToken,
          buyerShippingAddressID: val
        })
          .subscribe((res) => {
            if (res.querySuccess) {
              this.isSelectOneAddress = true;
              this.addressData = res.queryResult[0];
            }
            else {
              this.isSelectOneAddress = false;
            }
          }, (err) => {
            console.log("获取地址错误");
          });
      }
    });
  }

  pushChooesAddressPage() {
    this.navCtrl.push('ChooseAddressPage');
  }

  submitOrder() {

    this.orderSvc.submitOrderData({
      buyerID: this.myID,
      buyerToken: this.myToken,
      sellerID: this.sellerID,
      ordersShippingCharge: this.shippingCharge,
      ordersPackCharge: this.packCharge,
      ordersNote: this.note,
      consigneeName: this.addressData.consigneeName,
      consigneeGender: this.addressData.consigneeGender,
      consigneePhoneNumber: this.addressData.consigneePhoneNumber,
      consigneeAddress: this.addressData.consigneeAddress,
      ordersProduct: this.cartList
    })
      .subscribe((res) => {
        if (res.querySuccess){
          this.navCtrl.push('OrderPage');
        }
        else console.log("提交订单失败");
      }, (err) => {
        console.log("order-server-err");
      });

  }

}
