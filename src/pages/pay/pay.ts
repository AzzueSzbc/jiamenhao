import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { OrderServiceProvider } from '../../providers/order-service/order-service'
import { ChooseAddressPage } from '../choose-address/choose-address';

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

  hostsURL: string = 'http://144.202.120.126:888/';
  myID: string;
  myToken: string;

  cartList: any[];
  orderProduct: any[];
  shippingCharge: any;
  packCharge: number = 2;

  addressData: any;
  isSelectOneAddress: boolean = false;
  paySum: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public orderSvc: OrderServiceProvider,
    private storage: Storage, ) {

    this.storage.get('cartlist').then((val) => {
      this.cartList = val;
      this.cartList.forEach((g) => {
        this.paySum += g.goodsPrice * g.goodsNumber;
      });
    });

    this.shippingCharge = navParams.get('shippingCharge');

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
    this.navCtrl.push(ChooseAddressPage);
  }

  submitOrder() {
    this.orderSvc.submitOrderData({
      buyerID: this.myID,
      buyerToken: this.myToken,
      ordersShippingCharge: this.shippingCharge,
      ordersPackCharge: this.packCharge,
      consigneeName: this.addressData.consigneeName,
      consigneeGender: this.addressData.consigneeGender,
      consigneePhoneNumber: this.addressData.consigneePhoneNumber,
      consigneeAddress: this.addressData.consigneeAddress,
      product: this.cartList
    });

  }

}
