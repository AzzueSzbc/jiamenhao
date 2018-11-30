import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';
import { StorageProvider } from '../../providers/storage/storage';
import { UserProvider } from '../../providers/user/user';
import { PICTURE_WAREHOUSE_URL } from '../../providers/config';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-userdata',
  templateUrl: 'userdata.html',
})
export class UserdataPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  userData: any;
  islogined: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    private userPvd: UserProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserdataPage');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }
  //更新显示
  refreshDisplay() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.userPvd.getUserBasicData(buyer.userID,buyer.token)
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
  }

  userLogout() {
    this.storagePvd.removeStorageAccount().then((val) => {
      console.log(val);
      this.events.publish('user:logout');
      this.navCtrl.pop();
    });
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
