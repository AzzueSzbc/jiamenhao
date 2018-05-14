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
import { ChooseAddressPage } from '../pages/choose-address/choose-address';
import { AddAddressPage } from '../pages/add-address/add-address';

import { ListPage } from '../pages/list/list';

import { UserPage } from '../pages/user/user';
import { UserdataPage } from '../pages/userdata/userdata';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { HermesProvider } from '../providers/hermes/hermes';
import { ShopServiceProvider } from '../providers/shop-service/shop-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { OrderServiceProvider } from '../providers/order-service/order-service';

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
    ChooseAddressPage,
    AddAddressPage,
    ListPage,
    UserPage,
    UserdataPage,
    SettingsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
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
    ChooseAddressPage,
    AddAddressPage,
    ListPage,
    UserPage,
    UserdataPage,
    SettingsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HermesProvider,
    ShopServiceProvider,
    UserServiceProvider,
    OrderServiceProvider
  ]
})
export class AppModule {}
