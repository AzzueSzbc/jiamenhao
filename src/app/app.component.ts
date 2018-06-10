import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HermesProvider } from '../providers/hermes/hermes';

import { TabsPage } from '../pages/tabs/tabs';
import { EntrancePage } from '../pages/entrance/entrance';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  public rootPage: any;
  public hostsURL: string = 'http://120.78.220.83:22781/';

  myID: string;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public hermes: HermesProvider,
    private storage: Storage
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.storage.get('clientid').then((val) => { this.myID = val });
      this.storage.get('clienttoken').then((results) => {
        if (results) {
          this.hermes.tokenLogin({
            buyerID: this.myID,
            buyerToken: results,
          }).subscribe((res) => {
            if (res==true) {
              //成功登录
              this.rootPage = TabsPage;
            }//程序错误
            else if (res==false) {
              this.rootPage = EntrancePage;
            }
          }, (err) => {
            console.log("-------Oooops!");
          });
        } else {
          this.rootPage = EntrancePage;
        }
      });
    });
  }
}
