import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ShopProvider } from '../../../providers/shop/shop';
import { UserProvider } from '../../../providers/user/user';
import { NativeProvider } from '../../../providers/native/native';

import { PICTURE_WAREHOUSE_URL } from '../../../providers/config';

@IonicPage()
@Component({
  selector: 'page-goods',
  templateUrl: 'goods.html',
})
export class GoodsPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  sellerID: string;
  shopData: any;
  cartGoodsList: any[] = [];
  classNames: string[] = ["全部"];
  chooseClassName: string = "全部";

  cartFlag = false;
  isQuery: boolean;

  isLogined: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private events: Events,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider,
    private userPvd: UserProvider) {
      this.sellerID = navParams.get('sellerid');
      console.log("GoodsPage-constructor-sellerID", this.sellerID);
      this.events.subscribe('user:logout', () => {
        this.isLogined = false;
        console.log("events user:logout");
      });
      this.events.subscribe('user:login', () => {
        this.isLogined = true;
      });
      this.nativePvd.getStorage('clientid').then((id) => {
        this.nativePvd.getStorage('clienttoken').then((token) => {
          if (token) {
            this.userPvd.getUserBasicData({
              buyerID: id,
              buyerToken: token,
            })
            .subscribe(
              (res) => {
                if (res == false) {
                  this.isLogined = false;
                }
                else {
                  this.isLogined = true;
                }
              },
              (err) => {
                console.log('pay-constructor-err', err);
              }
            );
          }
          else this.isLogined = false;
        });
      });
    }

  ionViewWillEnter() {
    this.refreshDisplay();
    this.syncCartGoodsList();
    this.calcTotal();
  }

  //更新显示
  refreshDisplay() {
  this.classNames = ["全部"];
    this.shopPvd.getOneShopData(this.navParams.get('sellerid'))
      .subscribe(
        (res) => {
          console.log("GoodsPage-refreshDisplay-getOneShopData-res:", res);
          if (res == false) {
            this.isQuery = false;
          }
          else if (res) {
            this.isQuery = true;
            this.shopData = res;
            this.shopData.shopProductClass.forEach((pdClass) => {
              //将每个分类名在className中注册
              this.classNames.push(pdClass.shopProductClassName);
              //为每个商品添加在购物车的数量
              //并为未设定商品图片的商品添加预定义图片URL
              pdClass.product.forEach((p) => {
                p['inCartNumber'] = 0;
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
    this.nativePvd.getStorage('shopping cart').then((val) => {
      if (val) {
        let n = this.sellerID;
        this.cartGoodsList = val.n;
      }
    });
  }
  //选择左侧菜单分类
  onChooseClass(classNmae) {
  //根据输入分类名参数改变当前选中分类
  this.chooseClassName = classNmae;
  console.log("chooseClassName:", this.chooseClassName);
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
    this.nativePvd.setStorage('shopping cart' + this.sellerID, this.cartGoodsList);
    console.log('cartList:' + this.sellerID + ':', this.cartGoodsList);
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
    this.nativePvd.setStorage('cartlist:' + this.sellerID, this.cartGoodsList);
    console.log('cartList:' + this.sellerID + ':', this.cartGoodsList);
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
      return '￥' + this.shopData.sellerShopStartShippingLimit / 100 + '起送';
    } else {
      return '还差￥' + (this.shopData.sellerShopStartShippingLimit - this.calcTotal().totalMoney) / 100 + '起送';
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
    this.nativePvd.setStorage('cartlist:' + this.sellerID, this.cartGoodsList);
    //同步购物车数据到用于显示的数组
    this.shopData.shopProductClass.forEach((pdClass) => {
      pdClass.product.forEach((p) => {
        p['inCartNumber'] = 0;
      });
    });
  }
  //进入提交订单页面
  pushPayPage() {
    if (this.isLogined) {
      if ((this.calcTotal().totalMoney >= this.shopData.sellerShopStartShippingLimit)&&(this.calcTotal().totalMoney > 0)) {
        this.nativePvd.setStorage('cartlist:' + this.sellerID, this.cartGoodsList);
        this.appCtrl.getRootNav().push('PayPage', {
          sellerid: this.sellerID,
          shippingcharge: this.shopData.sellerShopShippingCharge,

        });
      }
    }
    else {
      this.appCtrl.getRootNav().push('LoginPage');
    }
  }


}
