import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { NativeProvider } from '../../../providers/native/native';
import { StorageProvider } from '../../../providers/storage/storage';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-shipping-address',
  templateUrl: 'shipping-address.html',
})
export class ShippingAddressPage {

  address: any;

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
    public appCtrl: App,
    public modalCtrl: ModalController,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    private userPvd: UserProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShippingAddressPage');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
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

  //页面加载
  refreshDisplay() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.userPvd.getAllShippingAddress(buyer.userID,buyer.token)
          .subscribe(
            (res) => {
              if (res == false) { //请求失败进行提醒,主要是因为用户未登录
                this.status = "用户未登录";
                //this.detectNetworkError("请登录");  //检测网络
              } else if (res == null || res == []) {
                this.status = "没有相关数据";
              } else if (res) {
                this.status = "存在相关数据";
                this.address = res;
              } else this.status = "未知错误";
            },
            (err) => {
              console.log('get-all-address', err);
            }
          );
      }
    });
  }

  ModifyShippingAddress(addressID) {
    let modifyShippingAddressPage = this.modalCtrl.create('ModifyShippingAddressPage', {
      addressID: addressID
    });
    modifyShippingAddressPage.onDidDismiss((data) => {
      if (data) {
        this.refreshDisplay();
      }
    });
    modifyShippingAddressPage.present();
  }

  pushAddAddress() {
    this.navCtrl.push('AddAddressPage');
  }

  pushLoginPage() {
    this.appCtrl.getRootNav().push('LoginPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
