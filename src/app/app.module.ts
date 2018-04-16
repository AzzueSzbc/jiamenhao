import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { EntrancePage } from '../pages/entrance/entrance';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ShopPage } from '../pages/shop/shop';
import { PayPage } from '../pages/pay/pay';
import { ListPage } from '../pages/list/list';
import { ContactPage } from '../pages/contact/contact';
import { UserdataPage } from '../pages/userdata/userdata';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    EntrancePage,
    LoginPage,
    RegisterPage,
    TabsPage,
    HomePage,
    ShopPage,
    PayPage,
    ListPage,
    ContactPage,
    UserdataPage,
    SettingsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EntrancePage,
    LoginPage,
    RegisterPage,
    TabsPage,
    HomePage,
    ShopPage,
    PayPage,
    ListPage,
    ContactPage,
    UserdataPage,
    SettingsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
