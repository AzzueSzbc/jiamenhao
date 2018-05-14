import { Component } from '@angular/core';
import { App, NavParams, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserServiceProvider } from '../../providers/user-service/user-service';

import { LoginPage } from '../login/login';
import { SettingsPage } from '../settings/settings';
import { UserdataPage } from '../userdata/userdata';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  hostsURL: string = 'http://144.202.120.126:888/';
  myID: string;

  userData: any;

  islogined: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userSvc: UserServiceProvider,
    private storage: Storage,
    private app: App) {
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  ionViewDidEnter() {
    console.log('ContactPage ionViewDidEnter');
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
          this.islogined = res.querySuccess;
          if(res.querySuccess==true) {
          this.userData = res;
          console.log(this.userData);
          }
        }, (err) => {                                                           //错误处理
          console.log("获得用户数据错误！");
        });
      } else this.islogined = false;
    });
  }
  //push设置页面
  pushSettingsPage() {
    this.app.getRootNav().push(SettingsPage);
  }
  //push用户个人详细信息页面
  pushUserdataPage() {
    this.app.getRootNav().push(UserdataPage);
  }
  //push登录页面
  pushLoginPage() {
    this.app.getRootNav().push(LoginPage);
  }
}
