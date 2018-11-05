import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { OrderProvider } from '../../providers/order/order';

import { PICTURE_WAREHOUSE_URL } from '../../providers/config';

import { TabsPage } from '../tabs/tabs';

declare var BMap;

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  @ViewChild('map_container') map_container: ElementRef;
  map: any;

  orderID: string;

  orderData: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativePvd: NativeProvider,
    private orderPvd: OrderProvider) {
  }

  ionViewWillLoad() {
    this.orderID = this.navParams.get('orderid');
    console.log('order-orderID', this.orderID);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    this.refreshDisplay();
  }

  refreshDisplay() {
    this.nativePvd.getStorage('clientid').then((id) => {
      this.nativePvd.getStorage('clienttoken').then((token) => {
        if (token) {
          this.orderPvd.getOneOrder({
            buyerID: id,
            buyerToken: token,
            ordersID: this.orderID
          })
            .subscribe(
              (res) => {
                if (res == false) {
                } else if (res == null) {
                } else if (res) {
                  this.orderData = res;
                  console.log('order-getOneOrder-res', res);
                  this.displayMap();
                }
              },
              (err) => {
                console.log('order-getOneOrder-err', err);
              }
            );
        }
      });
    });
  }

  displayMap() {
    this.nativePvd.getStorage('location').then((location) => {
      let map = new BMap.Map(this.map_container.nativeElement);    // 创建Map实例
      map.centerAndZoom(new BMap.Point(location.longitude, location.latitude), 15);
      map.setCurrentCity("贵港");          // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

    });

  }

  pagePop() {
    this.navCtrl.popToRoot();
  }



}
