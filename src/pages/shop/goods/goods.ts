import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ShopProvider } from '../../../providers/shop/shop';
import { UserProvider } from '../../../providers/user/user';
import { NativeProvider } from '../../../providers/native/native';

import { PICTURE_WAREHOUSE_URL } from '../../../providers/config';

@Component({
  selector: 'page-goods',
  templateUrl: 'goods.html',
})
export class GoodsPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  commodityClass: any[] = [];
  classNames: string[] = ["全部"];
  chooseClassName: string = "全部";

  startShippingLimit = 0;

  cart: any[] = [];
  cartFlag = false;

  //页面状态，状态描述分别为：
  //没有网络
  //加载中
  //没有相关数据
  //存在相关数据
  //未知错误
  status: string = "没有网络";

  isLogined: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private events: Events,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider,
    private userPvd: UserProvider) {
    console.log("data:", navParams.data);
    this.startShippingLimit = navParams.get('startShippingLimit');
    this.events.subscribe('user:logout', () => {
      this.isLogined = false;
      console.log("events user:logout");
    });
    this.events.subscribe('user:login', () => {
      this.isLogined = true;
    });
  }

  ionViewWillEnter() {
    this.getShoppingCartoftheShop().then((val) => {
      this.cart = val;
      this.refreshDisplay();
    });
    this.calcTotal();
  }

  //加载页面
  refreshDisplay() {
    this.classNames = ["全部"];
    this.commodityClass = this.navParams.get('commodityClass');
    if (this.commodityClass) {
      this.commodityClass.forEach((value) => {
        //将每个分类名在className中注册
        this.classNames.push(value.shopProductClassName);
        //为每个商品添加在购物车的数量
        value.product.forEach((p) => {
          p['inCartNumber'] = 0;
          //同步缓存中的购物车列表
          if (this.cart) {
            this.cart.forEach((g) => {
              if (p.productID == g.productID) {
                p.inCartNumber = g.productAmount;
              }
            });
          }
        })
      })
    }
  }

  //获取缓存数据中该店铺的购物车数据
  getShoppingCartoftheShop(): Promise<any> {
    return new Promise((resolve) => {
      this.nativePvd.getStorage('shopping cart').then((val) => {
        if (val) {
          if (val[this.navParams.get('sellerID')]) {
            resolve(val[this.navParams.get('sellerID')].commodites);
          } else resolve([]);
        } else resolve([]);
      });
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
    let have: boolean = false;
    //查找购物车中是否存在商品
    //如果存在修改购物车中商品数量为inCartNumber
    if (this.cart) {
      this.cart.forEach((gl) => {
        if (gl.productID == p.productID) {
          have = true;
          gl.productAmount = p.inCartNumber;
        }
      });
      //如果不存在该商品将商品添加入购物车列表
      if (!have) {
        this.cart.splice(-1, 0, {
          productID: p.productID,
          productAmount: p.inCartNumber,
          name: p.name,
          price: p.price,
          pictureURL: p.pictureURL,
        });
      }
    }
    //如果购物车中没有商品则添加商品
    else {
      this.cart = [{
        productID: p.productID,
        productAmount: p.inCartNumber,
        name: p.name,
        price: p.price,
        pictureURL: p.pictureURL,
      }];
    }
    this.getShoppingCartoftheShop().then((cart) => {

    })
    this.syncCarttoStorage();
    //console.log('GoodsPage cart:', this.cart);
  }

  //右侧商品列表中移除一个商品的购物车数量
  onRemoveChage(p) {
    --p.inCartNumber;
    this.cart.forEach((gl, index) => {
      if (gl.productID == p.productID) {
        gl.productAmount = p.inCartNumber;
      }
      if (gl.productAmount == 0) {
        this.cart.splice(index, 1);
      }
    });
    this.syncCarttoStorage();
    //console.log('GoodsPage cart:', this.cart);
  }

  //将购物车数据同步到缓存数据中
  syncCarttoStorage() {
    this.nativePvd.getStorage('shopping cart').then((val) => {
      //缓存中存在购物车数据
      if (val) {
        //缓存购物车数据中存在该店铺的购物车
        if (val[this.navParams.get('sellerID')]) {
          //将本页的购物车变动同步到缓存
          val[this.navParams.get('sellerID')].commodites = this.cart;
          this.nativePvd.setStorage('shopping cart', val).then((val) => {
            //改变缓存
            this.events.publish('shopping cart change');
            //console.log("GoodsPage syncCarttoStorage setStorage shopping cart:", val);
          });
        } else {  //缓存购物车数据中不存在该店铺的购物车
          //为该店铺在缓存购物车数据中创建购物车
          let cart = {
            sellerID: this.navParams.get('sellerID'),
            shopName: this.navParams.get('shopName'),
            businessHours: this.navParams.get('businessHours'),
            packageCharge: this.navParams.get('packageCharge'),
            startShippingLimit: this.navParams.get('startShippingLimit'),
            commodites: this.cart
          }
          val[this.navParams.get('sellerID')] = cart;
          this.nativePvd.setStorage('shopping cart', val).then((val) => {
            //改变缓存
            this.events.publish('shopping cart change');
            //console.log("GoodsPage syncCarttoStorage setStorage shopping cart:", val);
          });
        }
      } else {  //缓存中不存在购物车数据
        //创建购物车数据
        let cart = {
          sellerID: this.navParams.get('sellerID'),
          shopName: this.navParams.get('shopName'),
          businessHours: this.navParams.get('businessHours'),
          packageCharge: this.navParams.get('packageCharge'),
          startShippingLimit: this.navParams.get('startShippingLimit'),
          commodites: this.cart
        }
        let newVal = {}
        newVal[this.navParams.get('sellerID')] = cart;
        this.nativePvd.setStorage('shopping cart', newVal).then((val) => {
          //改变缓存
          this.events.publish('shopping cart change');
          //console.log("GoodsPage syncCarttoStorage setStorage shopping cart:", val);
        });
      }
    })
  }

  //计算购物车中商品总数，以及商品总价
  calcTotal() {
    const temp = { totalNum: 0, totalMoney: 0 };
    if (this.cart) {
      for (let i = 0; i < this.cart.length; i++) {
        temp.totalMoney += this.cart[i].price * this.cart[i].productAmount;
        temp.totalNum += this.cart[i].productAmount;
      }
    }
    return temp;
  }
  //计算目前购物车总价是否满足起送价
  changeTxt() {
    if (!this.calcTotal().totalNum) {
      return '￥' + this.startShippingLimit / 100 + '起送';
    } else {
      return '还差￥' + (this.startShippingLimit - this.calcTotal().totalMoney) / 100 + '起送';
    }
  }
  //点击打开购物车详情
  openCartToggle() {
    if (this.cart.length) {
      this.cartFlag = !this.cartFlag;
    }
  }
  //点击清空购物车
  onDeleteAllCartGoods() {
    //清空购物车数组
    this.cart = [];
    //关闭购物车部分显示
    this.cartFlag = !this.cartFlag;
    //同步购物车数据到缓存
    this.syncCarttoStorage();
    //同步购物车数据到用于显示的数组
    this.commodityClass.forEach((pdClass) => {
      pdClass.product.forEach((p) => {
        p['inCartNumber'] = 0;
      });
    });
  }

  //进入提交订单页面
  pushPayPage() {
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网
      //用户已登录
      if (this.isLogined) {
        if ((this.calcTotal().totalMoney >= this.startShippingLimit) && (this.calcTotal().totalMoney > 0)) {
          this.syncCarttoStorage();
          this.appCtrl.getRootNav().push('PayPage', {
            sellerID: this.navParams.get('sellerID'),
          });
        }
      }
      else {  //用户未登录
        this.appCtrl.getRootNav().push('LoginPage');
      }
    }, () => {
      //没有网络
      this.nativePvd.presentSimpleToast("网络不给力，请检查网络");
    });

  }


}
