import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { NativeProvider } from '../../../providers/native/native';

import { PICTURE_WAREHOUSE_URL } from '../../../providers/config';

@IonicPage()
@Component({
  selector: 'page-home4',
  templateUrl: 'home4.html',
})
export class Home4Page {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  commodites: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private nativePvd: NativeProvider) {}

  ionViewDidLoad() {
    console.log("navParams data:", this.navParams.data);
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  refreshDisplay() {
    if(this.navParams.get('commodites')) {
      this.commodites = this.navParams.get('commodites');
      console.log("Home0Page get commodites:", this.commodites);
      if (this.commodites) {
        this.commodites.forEach((p) => {
          //为每个商品添加在购物车的数量
            p['inCartNumber'] = 0;
            //同步缓存中的购物车列表
            this.getShoppingCartoftheShop().then((val) => {
              if (val) {
                val.forEach((c) => {
                  if (p.productID == c.productID) {
                    p.inCartNumber = c.productAmount;
                  }
                });
              }
              console.log("Home0Page after commodites", this.commodites);
            })
        })
      }
    }
  }

  //获取缓存数据中家门好的购物车数据
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

  //将购物车数据同步到缓存数据中
  syncCarttoStorage(cart) {
    this.nativePvd.getStorage('shopping cart').then((val) => {
      //缓存中存在购物车数据
      if (val) {
        //缓存购物车数据中存在该店铺的购物车
        if (val[this.navParams.get('sellerID')]){
          //将本页的购物车变动同步到缓存
          val[this.navParams.get('sellerID')].commodites = cart;
          this.nativePvd.setStorage('shopping cart', val).then((val) => {
            //改变缓存
            this.events.publish('shopping cart change');
            //console.log("GoodsPage syncCarttoStorage setStorage shopping cart:", val);
          });
        } else {  //缓存购物车数据中不存在该店铺的购物车
          //为该店铺在缓存购物车数据中创建购物车
          let tempCart = {
            sellerID: this.navParams.get('sellerID'),
            shopName: this.navParams.get('shopName'),
            businessHours: this.navParams.get('businessHours'),
            packageCharge: this.navParams.get('packageCharge'),
            startShippingLimit: this.navParams.get('startShippingLimit'),
            commodites:  cart
          }
          val[this.navParams.get('sellerID')] = tempCart;
          this.nativePvd.setStorage('shopping cart', val).then((val) => {
            //改变缓存
            this.events.publish('shopping cart change');
            //console.log("GoodsPage syncCarttoStorage setStorage shopping cart:", val);
          });
        }
      } else {  //缓存中不存在购物车数据
        //创建购物车数据
        let tempCart = {
          sellerID: this.navParams.get('sellerID'),
          shopName: this.navParams.get('shopName'),
          businessHours: this.navParams.get('businessHours'),
          packageCharge: this.navParams.get('packageCharge'),
          startShippingLimit: this.navParams.get('startShippingLimit'),
          commodites:  cart
        }
        let newVal = {}
        newVal[this.navParams.get('sellerID')] = tempCart;
        this.nativePvd.setStorage('shopping cart', newVal).then((val) => {
          //改变缓存
          this.events.publish('shopping cart change');
          //console.log("GoodsPage syncCarttoStorage setStorage shopping cart:", val);
        });
      }
    })
  }

  //右侧商品列表中增加一个商品的购物车数量
  onAddChange(p) {
    ++p.inCartNumber;
    //从缓存中获取家门好购物车数据
    this.getShoppingCartoftheShop().then((cart) => {
      //查找购物车中是否存在商品
      //如果存在修改购物车中商品数量为inCartNumber
      let have: boolean = false;
      if (cart) {
        cart.forEach((c) => {
          if (c.productID == p.productID) {
            have = true;
            c.productAmount = p.inCartNumber;
          }
        });
        //如果不存在该商品将商品添加入购物车列表
        if (!have) {
          cart.splice(-1, 0, {
            productID: p.productID,
            productAmount: p.inCartNumber,
            name: p.name,
            price: p.price,
            pictureURL: p.pictureURL,
          });
        }
      } else {  //如果购物车中没有商品则添加商品
        cart = [{
          productID: p.productID,
          productAmount: p.inCartNumber,
          name: p.name,
          price: p.price,
          pictureURL: p.pictureURL,
        }];
      }
      //将当前修改的商品数据保存到缓存
      this.syncCarttoStorage(cart);
    });
  }

  //右侧商品列表中移除一个商品的购物车数量
  onRemoveChage(p) {
    --p.inCartNumber;
    this.getShoppingCartoftheShop().then((cart) => {
      cart.forEach((c, index) => {
        if (c.productID == p.productID) {
          c.productAmount = p.inCartNumber;
        }
        if (c.productAmount == 0) {
          cart.splice(index, 1);
        }
      });
      this.syncCarttoStorage(cart);
    });
    this.events.publish('shopping cart change');
  }

}
