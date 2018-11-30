import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { StorageProvider } from '../../providers/storage/storage';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';

import { PICTURE_WAREHOUSE_URL } from '../../providers/config';

interface Order {
  userID: number;
  token: string;
  sellerID: string;
  shopName: string;
  addressData: any;
  orderProduct: any[];
  productTotalPrice: number;
  shippingCharge: number;
  packageCharge: number;
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
    userID: 0,
    token: '',
    sellerID: '',
    shopName: '',
    addressData: '',
    orderProduct: [],
    productTotalPrice: 0,
    shippingCharge: 0,
    packageCharge: 0,
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
    private events: Events,
    private orderPvd: OrderProvider,
    private userPvd: UserProvider,
    private storagePvd: StorageProvider,
    private nativePvd: NativeProvider) {
    //console.log("nav", this.navCtrl.getPrevious());
    //从导航参数中获得商家ID
    this.order.sellerID = navParams.get('sellerID');
    //console.log("sellerID", this.order.sellerID);
    //根据商家ID获得缓存中的对应店铺购物车数据
    this.nativePvd.getStorage('shopping cart').then((cart) => {
      //获得缓存中购物车数据的店铺名
      this.order.shopName = cart[this.order.sellerID].shopName;
      //获得缓存中购物车数据的购物车中商品
      this.order.orderProduct = cart[this.order.sellerID].commodites;
      //console.log('shopping cart:' + this.order.sellerID + ':', cart[this.order.sellerID]);
      //计算商品总价
      this.order.orderProduct.forEach((g) => {
        this.order.productTotalPrice += parseInt(g.price) * g.productAmount;
      });
      //获得缓存中购物车数据的店铺包装费
      this.order.packageCharge = parseInt(cart[this.order.sellerID].packageCharge);
      this.order.ActualPayment = this.order.shippingCharge + this.order.productTotalPrice + this.order.packageCharge;
      //alert("constructor order:"+ JSON.stringify(this.order));
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
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.order.userID = buyer.userID;
        this.order.token = buyer.token;
        if (buyer.defaultAddressID != -1) {
          this.userPvd.getOneShippingAddress(buyer.userID, buyer.token, buyer.defaultAddressID)
            .subscribe(
              (res) => {
                if (res == false) {
                  this.isSelectOneAddress = false;
                }
                else {
                  this.isSelectOneAddress = true;
                  this.order.addressData = res;
                }
              },
              (err) => {
                console.log('pay getPreselectionAddress err', err);
              });
        }
      }
    });
  }

  //提交订单
  submitOrder() {
    //检测订单中是否使用红包
    this.order.orderProduct.forEach((p) => {
      p.productID = parseInt(p.productID);
      p.price = parseInt(p.price);
    });
    if (this.order.useRedEnvelope) {
            //构建订单数据
            let post = {
              userID: this.order.userID,
              token: this.order.token,
              sellerID: this.order.sellerID,
              isUsingCoupon: true,
              couponID: this.order.redEnvelope.couponID,
              shippingCharge: this.order.shippingCharge,
              note: this.order.note,
              consigneeName:  this.order.addressData.consigneeName,
              consigneeGender:  this.order.addressData.consigneeGender,
              consigneePhoneNumber: this.order.addressData.consigneePhoneNumber,
              consigneeAddress: this.order.addressData.consigneeAddress,
              purchaseOrderProduct: this.order.orderProduct,
            }
            this.addNewOrder(post);
    } else {
      //构建订单数据
      let post = {
        userID: this.order.userID,
        token: this.order.token,
        sellerID: this.order.sellerID,
        isUsingCoupon: false,
        shippingCharge: this.order.shippingCharge,
        note: this.order.note,
        consigneeName:  this.order.addressData.consigneeName,
        consigneeGender:  this.order.addressData.consigneeGender,
        consigneePhoneNumber: this.order.addressData.consigneePhoneNumber,
        consigneeAddress: this.order.addressData.consigneeAddress,
        purchaseOrderProduct: this.order.orderProduct,
      }
      this.addNewOrder(post);
    }
  }

  //生成新订单
  addNewOrder(post) {
    alert("PayPage safeAddNewOrder.php post:" + JSON.stringify(post));
    console.log("PayPage addNewOrder post:", post);
    this.orderPvd.addNewOrder(post).subscribe(
      (res) => {
        //成功返回订单ID
        console.log("PayPage addNewOrder res:", res);
        if (res != false && res != null) {
          //清除缓存中该店铺的购物车
          this.cleartheShopShoppingCart();
          //进行订单支付
          this.pushPaymentMethodPage(parseInt(res.purchaseOrderID));
        }
      }, (err) => {
        alert("err:" + JSON.stringify(err));
        this.nativePvd.presentSimpleAlert("出错了QAQ");
      }
    )
  }


  //组成时间字符串
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

  //清除缓存中该店铺的购物车
  cleartheShopShoppingCart() {
    this.nativePvd.getStorage('shopping cart').then((cart) => {
      delete cart[this.order.sellerID];
      this.nativePvd.setStorage('shopping cart', cart).then(() => {
        //改变缓存
        this.events.publish('shopping cart change');
      });
    });
  }

  //打开地址选择页面
  pushChooseAddressPage() {
    this.navCtrl.push('ChooseAddressPage');
  }

  //打开添加备注页面
  pushAddOrderNotePage() {
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

  //打开选择红包页面
  pushChooseRedEnvelopePage() {
    let chooseRedEnvelopePage = this.modalCtrl.create('ChooseRedEnvelopePage', {
      productTotalPrice: this.order.productTotalPrice
    });
    chooseRedEnvelopePage.onDidDismiss((data) => {
      console.log("PayPage pushChooesAddressPage chooseRedEnvelopePage onDidDismiss data:", data);
      if (data) {
        this.order.useRedEnvelope = true;
        this.order.redEnvelope = data;
        this.order.ActualPayment = this.order.productTotalPrice + this.order.shippingCharge + this.order.packageCharge - this.order.redEnvelope.moneySubtractionAmount;
        console.log("PayPage pushChooesAddressPage chooseRedEnvelopePage onDidDismiss order.ActualPayment:", this.order.ActualPayment);
      }
    });
    chooseRedEnvelopePage.present();
  }

  //打开支付方式选择页面
  pushPaymentMethodPage(orderID) {
    this.appCtrl.getRootNav().push('PaymentMethodPage', {
      orderID: orderID
    });
  }

  //打开订单页面
  pushOrderPage(orderID) {
    this.appCtrl.getRootNav().push('OrderPage', {
      orderID: orderID
    });
  }

  pagePop() {
    this.navCtrl.pop();
  }

}
