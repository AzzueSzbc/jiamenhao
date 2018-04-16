import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';

import { PayPage } from '../pay/pay';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  public hostsURL: string = 'http://144.202.120.126:888/';
  displayUsingURL: string = 'forBuyerGetOneSeller.php';
  sellerID: string;

  test: string = 'hi';

  respData: any;
  shopData: any;

  cartGoodsList: any[];

  isLogin: boolean;
  isQuery: boolean;

  sgm: string = "goods";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http, private storage: Storage, ) {
    this.sellerID = navParams.get('sellerid');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
    this.syncCartGoodsList();
    this.onCalcTotal();
    this.storage.set(this.test, 'AAAAHHHHHH');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }
  //刷新显示
  refreshDisplay() {
    var link = this.hostsURL + this.displayUsingURL;
    var myData = JSON.stringify({ sellerID: this.sellerID });
    this.http.post(link, myData)
      .subscribe((res: Response) => {
        this.respData = res.json();
        console.log('disRespData:', this.respData);
        this.isQuery = this.respData.querySuccess;
        if (this.respData.querySuccess) {
          console.log('disRespData length:', this.respData.queryResult.length);
          this.shopData = this.respData.queryResult[0];
          this.shopData.shopProductClass.forEach((pdClass) => {
            //为每个商品添加在购物车的数量
            //并为未设定商品图片的商品添加预定义图片URL
            pdClass.product.forEach((p) => {
              p['inCartNumber'] = 0;
              if (!p.productPictureURL) p['productPictureURL'] = 'foodimg.jpeg';
              if (this.cartGoodsList) {
                this.cartGoodsList.forEach((g) => {
                  if(p.productName == g.goodsName) {
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
      }, error => {
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
  addChange(p) {
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
    console.log("cartGoodsList:", this.cartGoodsList);
  }
  //右侧商品列表中移除一个商品的购物车数量
  removeChage(p) {
    --p.inCartNumber;
    this.cartGoodsList.forEach((gl, index) => {
      if (gl.goodsName == p.productName) {
        gl.goodsNumber = p.inCartNumber;
      }
      if (gl.goodsNumber == 0) {
        this.cartGoodsList.splice(index, 1);
      }
    });
    console.log("cartGoodsList:", this.cartGoodsList);
  }
  //计算购物车中商品总数，以及商品总价
  onCalcTotal() {
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
  onChangeTxt() {
    if (!this.onCalcTotal().totalNum) {
      return '￥' + this.shopData.sellerShopStartShippingLimit + '起送';
    } else {
      return '还差￥' + (this.shopData.sellerShopStartShippingLimit - this.onCalcTotal().totalMoney) + '起送';
    }
  }
  //进入提交订单页面
  toPay() {
    if (this.onCalcTotal().totalMoney >= this.shopData.sellerShopStartShippingLimit) {
      this.storage.set('cartlist', this.cartGoodsList);
      this.navCtrl.push(PayPage, {
        shippingCharge: this.shopData.sellerShopShippingCharge,
      });
    }
  }

}
