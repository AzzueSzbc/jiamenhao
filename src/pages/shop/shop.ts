import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';

import { ShopProvider } from '../../providers/shop/shop';
import { NativeProvider } from '../../providers/native/native';
import { PICTURE_WAREHOUSE_URL } from '../../providers/config';
import { STATUS_BAR_COLOR_PRIMARY } from '../../providers/config';

import { GoodsPage } from './goods/goods';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {


  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  shop: any;
  seller: any;

  isConnect: boolean;
  isLoading: boolean;
  isQuery: boolean;

  goodsRoot = GoodsPage;
  ratingRoot = 'RatingPage';
  sellerRoot = 'SellerPage';
  sellerParams: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {
    this.sellerParams = {
      sellerid: navParams.get('sellerid'),
    };
  }

  ionViewWillEnter() {
    this.statusBar.overlaysWebView(true);
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网
      this.isConnect = true;
      //加载页面
      this.isLoading = true;
      this.refreshDisplay().subscribe((res) => {
        console.log("DeliverPage ionViewWillEnter refreshDisplay res:", res);
      }, (err) => {
        console.log("DeliverPage ionViewWillEnter refreshDisplay err:", err);
      });
    }, () => {
      //没有网络
      this.isConnect = false;
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
                this.isQuery = false;
                this.detectNetworkError();
              } else if (res) {
                this.isQuery = true;
                this.shop = res;
              }
              //停止加载动画显示
              this.isLoading = false;
            },
            (err) => {  //http发生错误
              console.log('home-getallshop-err', err);
              this.isQuery = false;
              this.detectNetworkError();
              //停止加载动画显示
              this.isLoading = false;
            }
          )
          );
  }

  //网络错误处理
  detectNetworkError() {
    this.nativePvd.detectNetwork(() =>{
      this.nativePvd.presentSimpleToast("加载失败，请稍后重试");
    }, () => {
      this.isConnect = false;
    });
  }

  pagePop() {
    this.navCtrl.pop();
  }

}
