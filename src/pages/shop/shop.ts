import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ShopServiceProvider } from '../../providers/shop-service/shop-service';

import { PayPage } from '../pay/pay';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  hostsURL: string = 'http://144.202.120.126:888/';
  sellerID: string;

  shopData: any;
  cartGoodsList: any[];

  cartFlag = false;
  isQuery: boolean;
  sgm: string = "goods";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public shopSvc: ShopServiceProvider,
    private storage: Storage, ) {

    this.sellerID = navParams.get('sellerid');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
    this.syncCartGoodsList();
    this.calcTotal();
  }

  //更新显示
  refreshDisplay() {
    this.shopSvc.getOneShopData(this.sellerID).subscribe((res) => {
      this.isQuery = res.querySuccess;
      if (res.querySuccess) {
        this.shopData = res.queryResult[0];
        this.shopData.shopProductClass.forEach((pdClass) => {
          //为每个商品添加在购物车的数量
          //并为未设定商品图片的商品添加预定义图片URL
          pdClass.product.forEach((p) => {
            p['inCartNumber'] = 0;
            if (!p.productPictureURL) p['productPictureURL'] = 'foodimg.jpeg';
            if (this.cartGoodsList) {
              this.cartGoodsList.forEach((g) => {
                if (p.productName == g.goodsName) {
                  p.inCartNumber = g.goodsNumber;
                }
              });
            }
          });
        });
      }
      else {
        console.log("querySuccess-false");
        this.isQuery = false;
      }
    }, (err) => {
      console.log("我日我求你别错了!");
    });

  }
  //同步购物车缓存数据
  syncCartGoodsList() {
    this.storage.get('cartlist').then((val) => {
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
        if (gl.goodsName == p.productName) {
          tempFlag = true;
          gl.goodsNumber = p.inCartNumber;
        }
      });
      if (!tempFlag) {
        this.cartGoodsList.splice(-1, 0, {
          goodsName: p.productName,
          goodspicture: p.productPictureURL,
          goodsNumber: p.inCartNumber,
          goodsPrice: p.productPrice,
        });
      }
    }
    else {
      this.cartGoodsList = [{
        goodsName: p.productName,
        goodspicture: p.productPictureURL,
        goodsNumber: p.inCartNumber,
        goodsPrice: p.productPrice
      }];
    }
    this.storage.set('cartlist', this.cartGoodsList);
    console.log("cartGoodsList:", this.cartGoodsList);
  }
  //右侧商品列表中移除一个商品的购物车数量
  onRemoveChage(p) {
    --p.inCartNumber;
    this.cartGoodsList.forEach((gl, index) => {
      if (gl.goodsName == p.productName) {
        gl.goodsNumber = p.inCartNumber;
      }
      if (gl.goodsNumber == 0) {
        this.cartGoodsList.splice(index, 1);
      }
    });
    this.storage.set('cartlist', this.cartGoodsList);
    console.log("cartGoodsList:", this.cartGoodsList);
  }
  //计算购物车中商品总数，以及商品总价
  calcTotal() {
    const temp = { totalNum: 0, totalMoney: 0 };
    if (this.cartGoodsList) {
      for (let i = 0; i < this.cartGoodsList.length; i++) {
        temp.totalMoney += this.cartGoodsList[i].goodsPrice * this.cartGoodsList[i].goodsNumber;
        temp.totalNum += this.cartGoodsList[i].goodsNumber;
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
    this.storage.set('cartlist', this.cartGoodsList);
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
      this.storage.set('cartlist', this.cartGoodsList);
      this.navCtrl.push(PayPage, {
        shippingCharge: this.shopData.sellerShopShippingCharge,
      });
    }
  }

}
