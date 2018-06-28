import { Component } from '@angular/core';
import { App, NavParams, NavController } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { UserProvider } from '../../providers/user/user';
import { APP_SERVE_URL } from '../../providers/config';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  hostsURL: string = APP_SERVE_URL;

  userData: any;
  islogined: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private userPvd: UserProvider,
    private nativePvd: NativeProvider,
    private app: App) {}

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
              if (res == false) {
                this.islogined = false;
              }
              else {
                this.islogined = true;
                this.userData = res;
              }
            },
            (err) => {
              console.log('user-getUserBasicData-err', err);
            }
          );
        }
        else this.islogined = false;
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
  //push登录页面
  pushLoginPage() {
    this.app.getRootNav().push(LoginPage);
  }
}
