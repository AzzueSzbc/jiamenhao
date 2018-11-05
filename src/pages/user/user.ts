import { Component } from '@angular/core';
import { App, NavParams, NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { NativeProvider } from '../../providers/native/native';
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
    this.nativePvd.getStorage('clientid').then((id) => {
      this.nativePvd.getStorage('clienttoken').then((token) => {
        if (token) {
          this.userPvd.getUserBasicData({
            buyerID: id,
            buyerToken: token,
          })
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
        }
        else this.isLogined = false;
      });
    });
  }
  //push设置页面
  pushSettingsPage() {
    this.app.getRootNav().push('SettingsPage');
  }
  //push用户个人详细信息页面
  pushUserdataPage() {
    this.app.getRootNav().push('UserdataPage');
  }
  pushRedEnvelopePage() {
    if (this.isLogined == true) {
      this.app.getRootNav().push('RedEnvelopePage');
    }
  }
  //push登录页面
  pushLoginPage() {
    this.app.getRootNav().push('LoginPage');
  }

  pushShippingAddress() {
    this.app.getRootNav().push('ShippingAddressPage');
  }

  


}
