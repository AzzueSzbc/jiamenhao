import { Component } from '@angular/core';
import { App, NavParams, NavController } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { UserProvider } from '../../providers/user/user';
import { APP_SERVE_URL } from '../../providers/config';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  hostsURL: string = APP_SERVE_URL;

  userData: any;
  islogined: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private userPvd: UserProvider,
    private nativePvd: NativeProvider,
    private app: App,
    private events: Events) {
      this.events.subscribe('user:logout', () => {
        this.islogined = false;
      });
      this.events.subscribe('user:login', () => {
        this.refreshDisplay();
      });
      this.events.subscribe('user:notokenlgoin', (username, token) => {
        this.userPvd.getUserBasicData({
          buyerID: username,
          buyerToken: token
        })
        .subscribe(
          (res) => {
            console.log('events-notokenlogin-res', res);
            if (res == false) {
              this.islogined = false;
            }
            else if (res) {
              this.islogined = true;
              this.userData = res;
            }
          },
          (err) => {
            console.log('events-err', err);
          }
        )
      })
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
              console.log('refreshDisplay-res', res);
              if (res == false) {
                this.islogined = false;
              }
              else if (res) {
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
    this.app.getRootNav().push('LoginPage');
  }
}
