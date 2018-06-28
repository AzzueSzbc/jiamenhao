import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NativeProvider } from '../providers/native/native';
import { VerifyProvider } from '../providers/verify/verify';

import { TabsPage } from '../pages/tabs/tabs';
import { EntrancePage } from '../pages/entrance/entrance';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  public rootPage: any;

  myID: string;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private nativePvd: NativeProvider,
    private verifyPvd: VerifyProvider,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.nativePvd.getStorage('clientid').then((id) => {
        this.nativePvd.getStorage('clienttoken').then((token) => {
          if (token) {
            this.verifyPvd.tokenLogin({
              buyerID: id,
              buyerToken: token
            }).subscribe(
              (res) => {
                //login success
                if (res == true) this.rootPage = TabsPage;
                //login failed
                else if (res == false) this.rootPage = EntrancePage;
              },
              (err) => {
                console.log(err);
              });
          }
          //no token in storage
          else this.rootPage = EntrancePage;
        })
      });
    });
  }
}
