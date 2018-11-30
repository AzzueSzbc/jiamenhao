import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { StatusBar } from '@ionic-native/status-bar';

import { ShopProvider } from '../../providers/shop/shop';
import { NativeProvider } from '../../providers/native/native';
import { PICTURE_WAREHOUSE_URL } from '../../providers/config';
import { STATUS_BAR_COLOR_PRIMARY } from '../../providers/config';

import { GoodsPage } from './goods/goods';

@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {


  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  shop: any;
  seller: any;

  //页面状态，状态描述分别为：
  //没有网络
  //加载中
  //用户未登录
  //没有相关数据
  //存在相关数据
  //未知错误
  status: string = "没有网络";

  goodsRoot = GoodsPage;
  goodsParame: any;
  ratingRoot = 'RatingPage';
  ratingParame: any;
  sellerRoot = 'SellerPage';
  sellerParame: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {}

  ionViewWillEnter() {
    this.statusBar.overlaysWebView(true);
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网
      this.status = "加载中";
      //加载页面
      this.refreshDisplay().subscribe((res) => {
        console.log("ShopPage ionViewWillEnter refreshDisplay res:", res);
      }, (err) => {
        console.log("ShopPage ionViewWillEnter refreshDisplay err:", err);
      });
    }, () => {
      //没有网络
      this.status = "没有网络";
    });
  }

  ionViewDidLeave() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString(STATUS_BAR_COLOR_PRIMARY);
  }

  //更新显示
  refreshDisplay() {
      //获得商家店铺数据
      return this.shopPvd.getOneShopData(this.navParams.get('sellerid'))
        .pipe(
          tap(
            (res) => {
              console.log("ShopPage-refreshDisplay-getOneShopData-res:", res);
              if (res == false) {  //请求失败进行提醒
                this.status = "未知错误";
                this.detectNetworkError();
              } else if (res == null) {
                this.status = "没有相关数据";
              } else if (res) {
                this.shop = res;
                //时间字段处理（删去xx:yy:zz的:zz）
                this.shop.afterNoonCloseTime = this.shop.afterNoonCloseTime.substr(0,5);
                this.shop.afterNoonOpenTime = this.shop.afterNoonOpenTime.substr(0,5);
                this.shop.morningCloseTime = this.shop.morningCloseTime.substr(0,5);
                this.shop.morningOpenTime = this.shop.morningOpenTime.substr(0,5);
                //构建将要传给goodspage的参数goodsParame中的businessHours
                let businessHours = {
                  morningOpenTime:  parseInt(this.shop.morningOpenTime.replace(/[^\w]/g,'')),
                  morningCloseTime: parseInt(this.shop.morningCloseTime.replace(/[^\w]/g,'')),
                  afterNoonOpenTime:  parseInt(this.shop.afterNoonOpenTime.replace(/[^\w]/g,'')),
                  afterNoonCloseTime: parseInt(this.shop.afterNoonCloseTime.replace(/[^\w]/g,''))
                }
                //构建将要传给goodspage的参数goodsParame
                this.goodsParame = {
                  sellerID: this.shop.sellerID,
                  shopName: this.shop.shopName,
                  businessHours: businessHours,
                  commodityClass: this.shop.shopProductClass,
                  packageCharge: this.shop.packageCharge,
                  startShippingLimit: this.shop.startShippingLimit,
                }
                //构建将要传给ratingpage的参数ratingparame
                this.ratingParame = {
                  sellerID: this.shop.sellerID,
                }
                //构建将要传给sellerpage的参数sellerparame
                this.sellerParame = {
                  seller: {
                    shopName: this.shop.shopName,
                    shopTag: this.shop.shopTag,
                    shopPosition: this.shop.sellerShopPosition,
                    shopContactPhoneNumber: this.shop.shopContactPhoneNumber
                  }
                }
                console.log("businessHours:", businessHours);
                console.log("after:", this.shop);
                this.status = "存在相关数据";
              } else this.status = "未知错误";
            },
            (err) => {  //http发生错误
              this.status = "未知错误";
              this.detectNetworkError();
            }
          )
          );
  }

  //网络错误处理
  detectNetworkError() {
    this.nativePvd.detectNetwork(() =>{
      this.nativePvd.presentSimpleToast("加载失败，请稍后重试");
    }, () => {
      this.status = "没有网络";
    });
  }

  pagePop() {
    this.navCtrl.pop();
  }

}
