import { Component } from '@angular/core';
import { App, NavParams, NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { NativeProvider } from '../../providers/native/native';
import { StorageProvider } from '../../providers/storage/storage';
import { UserProvider } from '../../providers/user/user';

import { PICTURE_WAREHOUSE_URL } from '../../providers/config';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  userData: any;
  isLogined: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private events: Events,
    private statusBar: StatusBar,
    private userPvd: UserProvider,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    ) {
      this.events.subscribe('user:logout', () => {
        this.isLogined = false;
      });
      this.events.subscribe('user:login', () => {
        this.isLogined = true;
        this.refreshDisplay();
      });
    }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  ionViewDidEnter() {
    console.log('ContactPage ionViewDidEnter');
  }

  //更新显示
  refreshDisplay() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.userPvd.getUserBasicData(buyer.userID,buyer.token)
        .subscribe(
          (res) => {
            console.log("UserPage-refreshDisplay-getUserBasicData-res:", res);
            if (res == false) {
              this.isLogined = false;
            } else if (res == null) {
              ;
            } else if (res) {
              this.isLogined = true;
              this.userData = res;
            }
          },
          (err) => {
            console.log('user-getUserBasicData-err', err);
          }
        );
      } else this.isLogined = false;
    });
  }

  //打开登录页面
  pushLoginPage() {
    this.app.getRootNav().push('LoginPage');
  }

  //打开设置页面
  pushSettingsPage() {
    this.app.getRootNav().push('SettingsPage');
  }

  //打开用户个人详细信息页面
  pushUserdataPage() {
    this.app.getRootNav().push('UserdataPage');
  }

  //打开红包页面
  pushRedEnvelopePage() {
    if (this.isLogined == true) {
      this.app.getRootNav().push('RedEnvelopePage');
    }
  }

  //打开收货地址页面
  pushShippingAddress() {
    this.app.getRootNav().push('ShippingAddressPage');
  }

  //打开我的足迹页面
  //即将上线
  //转到显示“即将上线”的“我的邀请”页面
  pushMyFootprintPage() {
    this.app.getRootNav().push('MyInvitationPage');
  }

  //打开我的收藏页面
  //即将上线
  //转到显示“即将上线”的“我的邀请”页面
  pushMyCollectionPage() {
    this.app.getRootNav().push('MyInvitationPage');
  }

  //打开我的邀请页面
  //即将上线
  //转到显示“即将上线”的“我的邀请”页面
  pushMyInvitationPage() {
    this.app.getRootNav().push('PaymentMethodPage');
  }

  //打开客服热线页面
  pushCustomerServicePage() {
    this.app.getRootNav().push('CustomerServicePage');
  }

  //打开关于页面
  pushAboutPage() {
    this.app.getRootNav().push('AboutPage');
  }

  //打开投诉建议页面
  pushComplaintPage() {
    this.app.getRootNav().push('ComplaintPage');
  }

}
