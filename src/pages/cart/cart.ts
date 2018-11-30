import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { NativeProvider } from '../../providers/native/native';
import { StorageProvider } from '../../providers/storage/storage';
import { PICTURE_WAREHOUSE_URL } from '../../providers/config';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  carts: any[] = [];

  //页面状态，状态描述分别为：
  //没有网络
  //加载中
  //没有相关数据
  //存在相关数据
  //未知错误
  status: string = "加载中";

  isLogined: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private events: Events,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    private userPvd: UserProvider) {
      this.events.subscribe('user:logout', () => {
        this.isLogined = false;
      });
      this.events.subscribe('user:login', () => {
        this.isLogined = true;
      });
      this.events.subscribe('shopping cart change', () => {
        this.afresh();
      });
      this.storagePvd.getStorageAccount().then((buyer) => {
        if (buyer) {
          this.userPvd.getUserBasicData(buyer.userID, buyer.token).subscribe((res) => {
            if (res != false && res != null) {
              this.isLogined = true;
            } else this.isLogined = false;
          }, (err) => {
            this.status = "未知错误";
          })
        } else {

        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  ionViewWillEnter() {
    this.afresh();
  }

  afresh() {
    this.carts = [];
    this.nativePvd.getStorage('shopping cart').then((val) => {
      for (let i in val) {
        this.carts.push(val[i]);
      }
      this.carts.forEach((c) => {
        c['totalPrice'] = 0;
        c.commodites.forEach((commodity) => {
          c.totalPrice += parseInt(commodity.price) * commodity.productAmount;
        });
      });
      //console.log("cart:", this.carts);
      this.status = "存在相关数据";
    });
  }

  //计算目前购物车总价是否满足起送价
  changeTxt(cart) {
    if (!cart.totalPrice) {
      return '￥' + cart.startShippingLimit / 100 + '起送';
    } else {
      return '还差￥' + (cart.startShippingLimit - cart.totalPrice) / 100 + '起送';
    }
  }

  //进入提交订单页面
  pushPayPage(cart) {
    if (cart.totalPrice >= cart.startShippingLimit) {
      //确认用户是否联网
      this.nativePvd.detectNetwork(() => {
        //已联网
        if (this.status != "未知错误") {
          //用户已登录
          if (this.isLogined) {
              this.appCtrl.getRootNav().push('PayPage', {
                sellerID: cart.sellerID,
              });
          }
          else {  //用户未登录
            this.appCtrl.getRootNav().push('LoginPage');
          }
        } else {  //发生未知错误
          this.nativePvd.presentSimpleToast("未知错误");
        }
      }, () => {
        //没有网络
        this.nativePvd.presentSimpleToast("网络不给力，请检查网络");
      });
    }
  }

  emptyShoppingCart() {
    this.nativePvd.removeStorage('shopping cart').then(() => {
      //改变缓存
      this.events.publish('shopping cart change');
    });
  }

}
