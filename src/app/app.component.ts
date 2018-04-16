import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Http, Response } from '@angular/http';

import { TabsPage } from '../pages/tabs/tabs';
import { EntrancePage } from '../pages/entrance/entrance';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  public rootPage: any;
  public hostsURL: string = 'http://144.202.120.126:888/';

  usingURL: string = 'buyerTokenLogin.php';
  myID:     string;

  respData: any = {};

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public http: Http,
              private alertCtrl: AlertController,
              private storage: Storage
              ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.storage.get('clientid').then((val)=>{this.myID = val});
      this.storage.get('clientToken').then((results) => {
        if (results) {
          var link = this.hostsURL + this.usingURL;
          var myData = JSON.stringify({ buyerID: this.myID, buyerToken: results });
          console.log("buyerID:",this.myID,"buyerToken:",results);
          this.http.post(link, myData)
            .subscribe((res: Response) => {

              this.respData = res.json();

              if (this.respData.querySuccess){
                this.rootPage = TabsPage;
                this.storage.set('clientToken', this.respData.buyerToken);
              }
              else {
                let alert = this.alertCtrl.create({
                  title: '提示信息',
                  subTitle: '用户身份验证过期，请重新登录',
                  buttons: ['确定']
                });
                alert.present();
                this.rootPage = EntrancePage;
              }
            }, error => {
              console.log("-------Oooops!");
            });
        } else {
          this.rootPage = EntrancePage;
        }
      });
    });
  }
}
