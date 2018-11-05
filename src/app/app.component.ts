import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { NativeProvider } from '../providers/native/native';
import { VerifyProvider } from '../providers/verify/verify';

import { TabsPage } from '../pages/tabs/tabs';

import { STATUS_BAR_COLOR_PRIMARY  } from '../providers/config';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public events: Events,
    private network: Network,
    private nativePvd: NativeProvider,
    private verifyPvd: VerifyProvider,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
      this.nativePvd.getStorage('clientid').then((id) => {
        this.nativePvd.getStorage('clienttoken').then((token) => {
          if (token) {
            this.verifyPvd.tokenLogin({
              buyerID: id,
              buyerToken: token
            })
              .subscribe(
                (res) => {
                  console.log('app-res', res);
                  if (res == true) {  //login success
                    this.events.publish('user:login');
                  } else if (res == false) { //login failed
                    this.events.publish('user:logout');
                  }
                },
                (err) => {
                  console.log(err);
                });
          } else {
            this.events.publish('user:logout');
          }
        });
      });

    });
  }
}
