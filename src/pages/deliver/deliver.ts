import { Component } from '@angular/core';
import { IonicPage, App, ViewController, NavController, NavParams, AlertController } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { StatusBar } from '@ionic-native/status-bar';

import { ShopProvider } from '../../providers/shop/shop';
import { NativeProvider } from '../../providers/native/native';
import { PICTURE_WAREHOUSE_URL } from '../../providers/config';
import { STATUS_BAR_COLOR_PRIMARY } from '../../providers/config';

import { ShopPage } from '../shop/shop';

@IonicPage()
@Component({
  selector: 'page-deliver',
  templateUrl: 'deliver.html',
})
export class DeliverPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  shops: any[] = [];

  location: string = "正在定位中...";

  //页面状态，状态描述分别为：
  //没有网络
  //加载中
  //用户未登录
  //没有相关数据
  //存在相关数据
  //未知错误
  status: string = "没有网络";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appCtrl: App,
    private alertCtrl: AlertController,
    public statusBar: StatusBar,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {
  }

  ionViewDidLoad() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString(STATUS_BAR_COLOR_PRIMARY);
    console.log('ionViewDidLoad RatingPage');
  }

  ionViewWillEnter() {
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网
      this.status = "加载中";
      //定位当前位置
      this.mapLocation();
      //加载页面
      this.refreshDisplay().subscribe((res) => {
        console.log("DeliverPage ionViewWillEnter refreshDisplay res:", res);
      }, (err) => {
        console.log("DeliverPage ionViewWillEnter refreshDisplay err:", err);
      });
    }, () => {
      //没有网络
      this.status = "没有网络";
    });
  }

  //更新显示
  refreshDisplay() {
    //已联网，获得所有商家店铺数据
    return this.shopPvd.getAllShopData()
      .pipe(
        tap((res) => {
          //console.log("DeliverPage-refreshDisplay-getAllShopData-res:", res);
          if (res == false) {  //请求失败进行提醒
            this.status = "未知错误";
            this.detectNetworkError();
          } else if (res == null) {
            this.status = "没有相关数据";
          } else if (res) {
            this.status = "存在相关数据";
            this.shops = res;
          } else this.status = "未知错误";
        },
          (err) => {  //http发生错误
            this.status = "未知错误";
            this.detectNetworkError();
          })
      );
  }

  //下拉刷新
  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网，加载页面
      this.status = "加载中";
      this.refreshDisplay().subscribe((res) => {
        //console.log('Async operation has ended');
        refresher.complete();
      }, (err) => {
      });
    }, () => {

      this.nativePvd.presentSimpleToast("加载失败，请检查网络");
      refresher.complete();
    });
  }
  //松开下拉按钮
  doPulling(refresher) {
    console.log('DOPULLING', refresher.progress);
  }

  //网络错误处理
  detectNetworkError() {
    this.nativePvd.detectNetwork(() =>{
      this.nativePvd.presentSimpleToast("加载失败，请稍后重试");
    }, () => {
      this.status = "没有网络";
    });
  }

  //地图定位
  mapLocation() {
    this.nativePvd.baidumap_location().then((result) => {
      this.location = (result.locationDescribe).replace('在', '');
    }, (error) => {
      this.location = "无法获得当前位置";
    })
  }

  //打开特定店铺
  pushOneShop(sellerID) {
    this.appCtrl.getRootNav().push(ShopPage, {
      sellerid: sellerID
    })
  }

}
