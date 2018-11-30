import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { StorageProvider } from '../../providers/storage/storage';
import { OrderProvider } from '../../providers/order/order';

import { PICTURE_WAREHOUSE_URL } from '../../providers/config';

import { TabsPage } from '../tabs/tabs';

declare var BMap;
declare let cordova;

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  @ViewChild('map_container') map_container: ElementRef;
  map: any;

  orderID: number;

  order: any;

  //页面状态，状态描述分别为：
  //没有网络
  //加载中
  //用户未登录
  //没有相关数据
  //存在相关数据
  //未知错误
  status: string = "加载中";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public appCtrl: App,
    private events: Events,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    private orderPvd: OrderProvider) {
    this.events.subscribe('user:login', () => {
      this.afresh();
    });
  }

  ionViewWillLoad() {
    //console.log('ionViewWillLoad OrderPage');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad OrderPage');
  }

  ionViewWillEnter() {
    this.orderID = parseInt(this.navParams.get('orderID'));
  }

  ionViewDidEnter() {
    this.afresh();
  }

  afresh() {
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网
      this.status = "加载中";
      //加载页面
      this.refreshDisplay();
    }, () => {
      //没有网络
      this.status = "没有网络";
    });
  }
  //加载显示
  refreshDisplay() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        let post = {
          userID: buyer.userID,
          token: buyer.token,
          purchaseOrderID: this.navParams.get('orderID')
        }
        //alert("OrderPage refreshDisplay post:" + JSON.stringify(post));
        this.orderPvd.getOneOrder(post)
          .subscribe(
            (res) => {
              if (res == false) {
                this.status = "用户未登录";
              } else if (res == null) {
                this.status = "没有相关数据";
              } else if (res) {
                this.order = res;
                console.log('order-getOneOrder-res', res);
                this.displayMap();
                this.status = "存在相关数据";
              } else this.status = "未知错误";
            },
            (err) => {
              this.status = "未知错误";
              //网络检测
              this.detectNetworkError();
              //console.log('order-getOneOrder-err', err);
            }
          );
      } else {
        //没有token未登录
        this.status = "用户未登录";
      }
    });
  }

  //网络错误处理
  detectNetworkError() {
    this.nativePvd.detectNetwork(() => {
      this.nativePvd.presentSimpleToast("加载失败，请稍后重试");
    }, () => {
      this.status = "没有网络";
    });
  }

  //显示地图
  displayMap() {
    //读取保存在缓存中的买家地址
    this.nativePvd.getStorage('location').then((location) => {
      // 创建Map实例
      let map = new BMap.Map(this.map_container.nativeElement);
      //创建买家位置
      let buyerPoint = new BMap.Point(location.longitude, location.latitude);
      //设置地图中央位置为买家位置
      map.centerAndZoom(buyerPoint, 15);
      //创建店铺地址解析器实例
      let shopGeo = new BMap.Geocoder();
      //将地址解析结果显示在地图上,并调整地图视野
      shopGeo.getPoint(this.order.seller.sellersellerShopPosition, (point) => {
        if (point) {
          map.centerAndZoom(point, 15);
          //创建小狐狸
          let shopIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300, 157));
          let marker2 = new BMap.Marker(point, { icon: shopIcon });  // 创建标注
          map.addOverlay(marker2);              // 将标注添加到地图中
        } else {
          alert("您选择地址没有解析到结果!");
        }
      }, "贵港市");
      //let shopPoint = new BMap.Point(location.longitude, location.latitude);
      //map.centerAndZoom(shopPoint, 15);
      map.setCurrentCity("贵港市");          // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true);      //开启鼠标滚轮缩放

    });

  }

  //支付订单
  onPayOrder() {
    this.pushPaymentMethodPage(this.orderID);
  }

  //评论订单
  onRateOrder() {
    let addRatingPage = this.modalCtrl.create('AddRatingPage', {
      orderID: this.orderID
    });
    addRatingPage.present();
  }

  //取消订单
  onCancelOrder() {
    this.nativePvd.presentSimpleAlert("订单正在进行，如想取消订单请联系商家。");
  }

  //打开支付方式选择页面
  pushPaymentMethodPage(orderID) {
    this.appCtrl.getRootNav().push('PaymentMethodPage', {
      orderID: orderID
    });
  }

  pushLoginPage() {
    this.appCtrl.getRootNav().push('LoginPage');
  }

  pagePop() {
    this.navCtrl.popToRoot();
  }

}
