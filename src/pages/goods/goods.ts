import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { ShopProvider } from '../../providers/shop/shop';
import { NativeProvider } from '../../providers/native/native';
import { APP_SERVE_URL } from '../../providers/config';

@IonicPage()
@Component({
  selector: 'page-goods',
  templateUrl: 'goods.html',
})
export class GoodsPage {

  hostsURL: string = APP_SERVE_URL;

  shopData: any;
  cartGoodsList: any[];

  cartFlag = false;
  isQuery: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {}

  ionViewWillEnter() {
    this.refreshDisplay();
    this.syncCartGoodsList();
    this.calcTotal();
  }

  //更新显示
  refreshDisplay() {
    this.shopPvd.getOneShopData(this.navParams.get('sellerid'))
      .subscribe(
        (res) => {
          if (res == false) {
            this.isQuery = false;
          }
          else if (res) {
            this.isQuery = true;
            console.log('goods-res', res);
            this.shopData = res;
            this.shopData.shopProductClass.forEach((pdClass) => {
              //为每个商品添加在购物车的数量
              //并为未设定商品图片的商品添加预定义图片URL
              pdClass.product.forEach((p) => {
                p['inCartNumber'] = 0;
                if (!p.productPictureURL) p['productPictureURL'] = 'foodimg.jpeg';
                if (this.cartGoodsList) {
                  this.cartGoodsList.forEach((g) => {
                    if (p.productName == g.ordersProductName) {
                      p.inCartNumber = g.ordersProductAmount;
                    }
                  });
                }
              });
            });
          }
        },
        (err) => {
          console.log('goods-getOneShopData-err', err);
        });
  }

  //同步购物车缓存数据
  syncCartGoodsList() {
    this.nativePvd.getStorage('cartlist').then((val) => {
      if (val) {
        this.cartGoodsList = val;
      }
    });
  }
  //右侧商品列表中增加一个商品的购物车数量
  onAddChange(p) {
    ++p.inCartNumber;
    let tempFlag: boolean = false;
    if (this.cartGoodsList) {
      this.cartGoodsList.forEach((gl) => {
        if (gl.ordersProductName == p.productName) {
          tempFlag = true;
          gl.ordersProductAmount = p.inCartNumber;
        }
      });
      if (!tempFlag) {
        this.cartGoodsList.splice(-1, 0, {
          productID: p.productID,
          ordersProductAmount: p.inCartNumber,
          ordersProductName: p.productName,
          ordersProductPrice: p.productPrice,
          ordersProductPictureURL: p.productPictureURL,
        });
      }
    }
    else {
      this.cartGoodsList = [{
        productID: p.productID,
        ordersProductAmount: p.inCartNumber,
        ordersProductName: p.productName,
        ordersProductPrice: p.productPrice,
        ordersProductPictureURL: p.productPictureURL,
      }];
    }
    this.nativePvd.setStorage('cartlist', this.cartGoodsList);
    console.log("cartGoodsList:", this.cartGoodsList);
  }
  //右侧商品列表中移除一个商品的购物车数量
  onRemoveChage(p) {
    --p.inCartNumber;
    this.cartGoodsList.forEach((gl, index) => {
      if (gl.ordersProductName == p.productName) {
        gl.ordersProductAmount = p.inCartNumber;
      }
      if (gl.ordersProductAmount == 0) {
        this.cartGoodsList.splice(index, 1);
      }
    });
    this.nativePvd.setStorage('cartlist', this.cartGoodsList);
    console.log("cartGoodsList:", this.cartGoodsList);
  }
  //计算购物车中商品总数，以及商品总价
  calcTotal() {
    const temp = { totalNum: 0, totalMoney: 0 };
    if (this.cartGoodsList) {
      for (let i = 0; i < this.cartGoodsList.length; i++) {
        temp.totalMoney += this.cartGoodsList[i].ordersProductPrice * this.cartGoodsList[i].ordersProductAmount;
        temp.totalNum += this.cartGoodsList[i].ordersProductAmount;
      }
    }
    return temp;
  }
  //计算目前购物车总价是否满足起送价
  changeTxt() {
    if (!this.calcTotal().totalNum) {
      return '￥' + this.shopData.sellerShopStartShippingLimit + '起送';
    } else {
      return '还差￥' + (this.shopData.sellerShopStartShippingLimit - this.calcTotal().totalMoney) + '起送';
    }
  }
  //点击打开购物车详情
  openCartToggle() {
    if (this.cartGoodsList.length) {
      this.cartFlag = !this.cartFlag;
    }
  }
  //点击清空购物车
  onDeleteAllCartGoods() {
    //清空购物车数组
    this.cartGoodsList = [];
    //关闭购物车部分显示
    this.cartFlag = !this.cartFlag;
    //同步购物车数据到缓存
    this.nativePvd.setStorage('cartlist', this.cartGoodsList);
    //同步购物车数据到用于显示的数组
    this.shopData.shopProductClass.forEach((pdClass) => {
      pdClass.product.forEach((p) => {
        p['inCartNumber'] = 0;
      });
    });
  }
  //进入提交订单页面
  pushPayPage() {
    if (this.calcTotal().totalMoney >= this.shopData.sellerShopStartShippingLimit) {
      this.nativePvd.setStorage('cartlist', this.cartGoodsList);
      this.appCtrl.getRootNav().push('PayPage', {
        sellerID: this.navParams.get('sellerid'),
        shippingCharge: this.shopData.sellerShopShippingCharge,
      });
    }
  }


}
