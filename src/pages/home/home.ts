import { Component } from '@angular/core';
import { App, ViewController, NavController, NavParams } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { StatusBar } from '@ionic-native/status-bar';

import { ShopProvider } from '../../providers/shop/shop';
import { NativeProvider } from '../../providers/native/native';
import { PICTURE_WAREHOUSE_URL } from '../../providers/config';
import { STATUS_BAR_COLOR_PRIMARY } from '../../providers/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sellerID = 7;
  shop: any;

  shopCommodityClass: any[] = [];
  shopBusinessHours: any;

  //页面状态，状态描述分别为：
  //没有网络
  //加载中
  //用户未登录
  //没有相关数据
  //存在相关数据
  //未知错误
  status: string = "加载中";

  location: string = "正在定位中...";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public statusBar: StatusBar,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) { }

    ionViewDidLoad() {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString(STATUS_BAR_COLOR_PRIMARY);
    }

    ionViewWillEnter() {
      this.afresh();
    }

    afresh() {
      //确认用户是否联网
      this.nativePvd.detectNetwork(() => {
        //已联网
        this.status = "加载中";
        //定位当前位置
        this.mapLocation();
        //加载页面
        this.refreshDisplay().subscribe((res) => {
          console.log("HomePage ionViewWillEnter refreshDisplay res:", res);
        }, (err) => {
          console.log("HomePage ionViewWillEnter refreshDisplay err:", err);
          this.status = "未知错误";
          this.detectNetworkError();
        });
      }, () => {
        //没有网络
        this.status = "没有网络";
        this.location = "定位失败";
      });
    }

    //更新显示
    refreshDisplay() {
      //获得商家店铺数据
      return this.shopPvd.getOneShopData(this.sellerID)
        .pipe(
          tap(
            (res) => {
              console.log("HomePage refreshDisplay getOneShopData:", res);
              if (res == false) {  //请求失败进行提醒
                this.status = "未知错误";
                this.detectNetworkError();
              } else if (res) {
                this.shop = res;
                this.shopCommodityClass = this.shop.shopProductClass;
                console.log(this.shopCommodityClass.sort(this.compare('sequenceOrder')));
                this.shopCommodityClass.forEach((value, index) => {
                  value['page'] = 'Home' + index + 'Page';
                });
                console.log("after",this.shopCommodityClass);
                //时间字段处理（删去xx:yy:zz的:zz）
                this.shop.afterNoonCloseTime = this.shop.afterNoonCloseTime.substr(0,5);
                this.shop.afterNoonOpenTime = this.shop.afterNoonOpenTime.substr(0,5);
                this.shop.morningCloseTime = this.shop.morningCloseTime.substr(0,5);
                this.shop.morningOpenTime = this.shop.morningOpenTime.substr(0,5);
                //构建将要传给goodspage的参数businessHours
                this.shopBusinessHours = {
                  morningOpenTime:  parseInt(this.shop.morningOpenTime.replace(/[^\w]/g,'')),
                  morningCloseTime: parseInt(this.shop.morningCloseTime.replace(/[^\w]/g,'')),
                  afterNoonOpenTime:  parseInt(this.shop.afterNoonOpenTime.replace(/[^\w]/g,'')),
                  afterNoonCloseTime: parseInt(this.shop.afterNoonCloseTime.replace(/[^\w]/g,''))
                }
                if (this.shopCommodityClass.length == 0) {
                  this.status = "没有相关数据";
                } else if (this.shopCommodityClass.length > 0) {
                  this.status = "存在相关数据";
                }
              }
            }
          )
        )
    }
    //升序排序
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    }

    //下拉刷新
    doRefresh(refresher) {
      console.log('Begin async operation', refresher);
      //确认用户是否联网
      this.nativePvd.detectNetwork(() => {
        //已联网，加载页面
        this.status = "加载中";
        this.refreshDisplay().subscribe((res) => {
          //console.log('Async operation has ended');
          refresher.complete();
          //alert("刷新完成");
        });
      }, () => {
        this.status = "没有网络";
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

}
