import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserServiceProvider } from '../../providers/user-service/user-service';

import { TabsPage } from '../tabs/tabs';
import { EntrancePage } from '../entrance/entrance';

@IonicPage()
@Component({
  selector: 'page-userdata',
  templateUrl: 'userdata.html',
})
export class UserdataPage {

  hostsURL: string = 'http://120.78.220.83:22781/';
  myID: string;

  userData: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userSvc: UserServiceProvider,
    private storage: Storage,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserdataPage');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }
  //更新显示
  refreshDisplay() {
    this.storage.get('clientid').then((val) => { this.myID = val });
    this.storage.get('clienttoken').then((val) => {                             //尝试获得id和token缓存
      if (val) {                                                                //存在token缓存
        this.userSvc.getUserBasicData({                                         //post给服务器
          buyerID: this.myID,
          buyerToken: val,
        })
        .subscribe((res) => {                                                   //返回用户数据，进行本地保存
          if (res.querySuccess) {
            this.userData = res.queryResult[0];
          }
        }, (err) => {                                                           //错误处理
          console.log("获得用户数据错误！");
        });
      } else this.navCtrl.push(EntrancePage);
    });
  }

  userLogout() {

    this.storage.remove('clientid');
    this.storage.remove('clienttoken');

    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();
  }

}
