  import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';

import { PICTURE_WAREHOUSE_URL } from '../../providers/config';

declare let cordova;

interface Order {
  buyerID: string;
  buyerToken: string;
  sellerID: string;
  addressData: any;
  orderProduct: any[];
  productTotalPrice: number;
  shippingCharge: number;
  packCharge: number;
  ActualPayment: number;
  haveNote: boolean;
  note: string;
  useRedEnvelope: boolean;
  redEnvelope: any;
}

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  order: Order = {
    buyerID: '',
    buyerToken: '',
    sellerID: '',
    addressData: '',
    orderProduct: [],
    productTotalPrice: 0,
    shippingCharge: 0,
    packCharge: 0,
    ActualPayment: 0,
    haveNote: false,
    note: '',
    useRedEnvelope: false,
    redEnvelope: ''
  };

  isSelectOneAddress: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public appCtrl: App,
    private orderPvd: OrderProvider,
    private userPvd: UserProvider,
    private nativePvd: NativeProvider) {
    this.order.sellerID = navParams.get('sellerid');
    console.log("sellerID", this.order.sellerID);
    this.nativePvd.getStorage('cartlist:' + this.order.sellerID).then((list) => {
      this.order.orderProduct = list;
      console.log('cartlist:' + this.order.sellerID + ':', list);
      this.order.orderProduct.forEach((g) => {
        this.order.productTotalPrice += g.ordersProductPrice * g.ordersProductAmount;
      });
      this.order.shippingCharge = parseInt(navParams.get('shippingcharge'));
      console.log('shippingCharge', this.order.shippingCharge, "paySum", this.order.productTotalPrice, "packCharge", this.order.packCharge);
      this.order.ActualPayment = this.order.shippingCharge + this.order.productTotalPrice + this.order.packCharge;
      console.log("ActualPayment", this.order.ActualPayment);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayPage');
  }
  ionViewWillEnter() {
    this.getPreselectionAddress();
  }



  //获取用户默认地址
  getPreselectionAddress() {
    this.nativePvd.getStorage('clientid').then((id) => {
      this.order.buyerID = id;
      this.nativePvd.getStorage('clienttoken').then((token) => {
        this.order.buyerToken = token;
        this.nativePvd.getStorage('addressid').then((address) => {
          if (address) {
            let post = {
              buyerID: id,
              buyerToken: token,
              buyerShippingAddressID: address
            }
            console.log("PayPage getPreselectionAddress post:", post);
            this.userPvd.getOneShippingAddress(post)
              .subscribe(
                (res) => {
                  console.log('PayPage-getPreselectionAddress-getOneShippingAddress-res:', res);
                  if (res == false) {
                    this.isSelectOneAddress = false;
                  }
                  else {
                    this.isSelectOneAddress = true;
                    this.order.addressData = res;
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

  //提交订单
  submitOrder() {
    console.log("PayPage-submitOrder-post", {
      buyerID: this.order.buyerID,
      buyerToken: this.order.buyerToken,
      sellerID: this.order.sellerID,
      ordersShippingCharge: this.order.shippingCharge,
      ordersPackCharge: this.order.packCharge,
      ordersNote: this.order.note,
      consigneeName:  this.order.addressData.consigneeName,
      consigneeGender:  this.order.addressData.consigneeGender,
      consigneePhoneNumber: this.order.addressData.consigneePhoneNumber,
      consigneeAddress: this.order.addressData.consigneeAddress,
      ordersActualPayment:  this.order.ActualPayment,
      ordersProduct: this.order.orderProduct,
    });
    this.orderPvd.submitOrderData({
      buyerID: this.order.buyerID,
      buyerToken: this.order.buyerToken,
      sellerID: this.order.sellerID,
      ordersShippingCharge: this.order.shippingCharge,
      ordersPackCharge: this.order.packCharge,
      ordersNote: this.order.note,
      consigneeName:  this.order.addressData.consigneeName,
      consigneeGender:  this.order.addressData.consigneeGender,
      consigneePhoneNumber: this.order.addressData.consigneePhoneNumber,
      consigneeAddress: this.order.addressData.consigneeAddress,
      ordersActualPayment:  this.order.ActualPayment,
      ordersProduct: this.order.orderProduct,
    })
      .subscribe(
        (res) => {
          if (res != false) {
            let timeString: string = this.getCurrentTime();
            let post = {
              ordersID: res.ordersID,
              out_trade_no: this.order.buyerID + timeString,
              total_amount: (this.order.ActualPayment / 100).toString()
            }
            this.orderPvd.payOrder(post)
              .subscribe(
                (payInfo) => {
                  cordova.plugins.alipay.payment(payInfo, (success) => {
                    // Success
                    alert("支付成功");
                    if (this.order.useRedEnvelope) {
                      this.userPvd.useCoupon(this.order.redEnvelope.couponID)
                        .subscribe(observer => {

                        }, error => {
                          alert("使用红包错误");
                        });
                    }
                    this.navCtrl.push('OrderPage', {
                      orderid: res.ordersID
                    });
                    this.nativePvd.removeStorage('cartlist:'+this.order.sellerID);
                  }, (error) => {
                    // Failed
                    alert("未支付");
                    if (this.order.useRedEnvelope) {
                      this.userPvd.useCoupon(this.order.redEnvelope.couponID)
                        .subscribe(observer => {

                        }, error => {
                          alert("使用红包错误");
                        });
                    }
                    this.navCtrl.push('OrderPage', {
                      orderID: res.ordersID
                    });
                    this.nativePvd.removeStorage('cartlist:'+this.order.sellerID);
                  });
                },
                (err) => console.log("PayPage-submitOrder-payOrder-err", err)
              );
            /*
            this.navCtrl.push('OrderPage', {
              orderid: res.ordersID
            });
            this.nativePvd.removeStorage('cartlist:'+this.sellerID);
            */
          }
        },
        (err) => {
          console.log('pay-submitOrder-err', err);
        });
  }

  getCurrentTime(){
    let myDate = new Date();
    //获取当前年
    let year=myDate.getFullYear();
    //获取当前月
    let month=myDate.getMonth()+1;
    //获取当前日
    let date=myDate.getDate();
    let h=myDate.getHours();       //获取当前小时数(0-23)
    let m=myDate.getMinutes();     //获取当前分钟数(0-59)
    let s=myDate.getSeconds();
    return year.toString()+this.addzero(month)+this.addzero(date)+this.addzero(h)+this.addzero(m)+this.addzero(s);
  }
  addzero(s){
    return s < 10 ? '0' + s: s;
  }

  pushChooseAddressPage() {
    this.navCtrl.push('ChooseAddressPage');
  }

  PushAddOrderNotePage() {
    //this.navCtrl.push('AddOrderNotePage');
    let addOrderNotePage = this.modalCtrl.create('AddOrderNotePage', {
      note: this.order.note
    });
    addOrderNotePage.onDidDismiss((data) => {
      if (data) {
        this.order.note = data.note;
        console.log("addOrderNotePage-onDidDismiss-order.note:", this.order.note);
      }
    });
    addOrderNotePage.present();
  }

  pushChooseRedEnvelopePage() {
    let chooseRedEnvelopePage = this.modalCtrl.create('ChooseRedEnvelopePage', {
      productTotalPrice: this.order.productTotalPrice
    });
    chooseRedEnvelopePage.onDidDismiss((data) => {
      console.log("PayPage pushChooesAddressPage chooseRedEnvelopePage onDidDismiss data:", data);
      if (data) {
        this.order.useRedEnvelope = true;
        this.order.redEnvelope = data;
        this.order.ActualPayment = this.order.productTotalPrice + this.order.shippingCharge + this.order.packCharge - this.order.redEnvelope.moneySubtractionAmount;
        console.log("PayPage pushChooesAddressPage chooseRedEnvelopePage onDidDismiss order.ActualPayment:", this.order.ActualPayment);
      }
    });
    chooseRedEnvelopePage.present();
  }

  pagePop() {
    this.navCtrl.pop();
  }

}
