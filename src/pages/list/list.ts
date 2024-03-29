import { Component } from '@angular/core';
import { App, NavController, Events, ModalController } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { StatusBar } from '@ionic-native/status-bar';

import { OrderProvider } from '../../providers/order/order';
import { NativeProvider } from '../../providers/native/native';
import { StorageProvider } from '../../providers/storage/storage';
import { PICTURE_WAREHOUSE_URL } from '../../providers/config';
import { STATUS_BAR_COLOR_LIGHT } from '../../providers/config';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  orders: any;

  //页面状态，状态描述分别为：
  //没有网络
  //加载中
  //用户未登录
  //没有相关数据
  //存在相关数据
  //未知错误
  status: string = "加载中";

  constructor(public navCtrl: NavController,
    public appCtrl: App,
    public modalCtrl: ModalController,
    public statusBar: StatusBar,
    private events: Events,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    private orderPvd: OrderProvider) {
    this.events.subscribe('user:logout', () => {
      this.status = "用户未登录"
      console.log("events user:logout");
    });
    this.events.subscribe('user:login', () => {
      this.afresh();
    });
  }

  ionViewWillEnter() {
    this.afresh();
  }

  afresh() {
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网
      this.status = "加载中";
      //加载页面
      this.refreshDisplay().then((res) => {
        console.log("ionViewWillEnter refreshDisplay res:", res);
      });
    }, () => {
      //没有网络
      this.status = "没有网络";
    });
  }

  //更新显示
  refreshDisplay(): Promise<any> {
    return new Promise((resolve) => {
      this.storagePvd.getStorageAccount().then((buyer) => {
        if (buyer) {
          this.orderPvd.getAllOrder({
            userID: buyer.userID,
            token: buyer.token,
          })
            .subscribe((res) => {
              console.log("ListPage-refreshDisplay-getAllOrder-res", res);
              if (res == false) { //请求失败进行提醒,主要是因为用户未登录
                this.status = "用户未登录";
                //this.detectNetworkError("请登录");  //检测网络
              } else if (res == null || res == []) {
                this.status = "没有相关数据";
              } else if (res) {
                this.status = "存在相关数据";
                this.orders = res;
                console.log(this.orders.sort(this.compare('purchaseOrderID')));
              } else this.status = "未知错误";
              resolve(res);
            },
            (err) => {
              this.status = "未知错误";
              //网络检测
              this.detectNetworkError("加载失败，请稍后重试");
              //console.log('list-getAllOrder-err', err);
              resolve(err);
            })
        } else {
          //没有token未登录
          this.status = "用户未登录";
          resolve(false);
        }
      });
    });

  }
  compare(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  }

  //下拉刷新
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网，加载页面
      this.status = "加载中";
      this.refreshDisplay().then((res) => {
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
  detectNetworkError(message: string) {
    this.nativePvd.detectNetwork(() =>{
      this.nativePvd.presentSimpleToast(message);
    }, () => {
      this.status = "没有网络";
    });
  }

  pushLoginPage() {
    this.appCtrl.getRootNav().push('LoginPage');
  }

  pushAddRatingPage(order) {
    //this.navCtrl.push('AddOrderNotePage');
    let addRatingPage = this.modalCtrl.create('AddRatingPage', {
      orderID: order.purchaseOrderID
    });
    addRatingPage.present();
  }

  pushOrderPage(order) {
    this.appCtrl.getRootNav().push('OrderPage', {
      orderID: order.purchaseOrderID
    });
  }

  onUrgeOrder() {
    this.nativePvd.presentSimpleAlert("已向商家催单");
  }

  onCancelOrder() {
    this.nativePvd.presentSimpleAlert("订单正在进行，如想取消订单请联系商家。");
  }

  onOnceAgain() {

  }

}
