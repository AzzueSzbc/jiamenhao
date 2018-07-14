import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { UserProvider } from '../../providers/user/user';
import { APP_SERVE_URL } from '../../providers/config';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-userdata',
  templateUrl: 'userdata.html',
})
export class UserdataPage {

  hostsURL: string = APP_SERVE_URL;

  userData: any;
  islogined: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private nativePvd: NativeProvider,
    private userPvd: UserProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserdataPage');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
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
              console.log('userdata-getUserBasicData-err', err);
            }
          );
        }
      });
    });
  }

  userLogout() {
    this.nativePvd.removeStorage('clientid');
    this.nativePvd.removeStorage('clienttoken');
    this.events.publish('user:logout');
    this.navCtrl.pop();
  }

}
