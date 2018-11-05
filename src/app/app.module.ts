import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { CartPage } from '../pages/cart/cart';
import { DeliverPage } from '../pages/deliver/deliver';
import { ShopPage } from '../pages/shop/shop';
import { GoodsPage } from '../pages/shop/goods/goods';
import { ListPage } from '../pages/list/list';
import { UserPage } from '../pages/user/user';

import { StatusBar } from '@ionic-native/status-bar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { SuperTabsModule } from 'ionic2-super-tabs';

import { HermesProvider } from '../providers/hermes/hermes';
import { NativeProvider } from '../providers/native/native';
import { VerifyProvider } from '../providers/verify/verify';
import { OrderProvider } from '../providers/order/order';
import { ShopProvider } from '../providers/shop/shop';
import { UserProvider } from '../providers/user/user';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    CartPage,
    DeliverPage,
    ShopPage,
    GoodsPage,
    ListPage,
    UserPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    CartPage,
    DeliverPage,
    ShopPage,
    GoodsPage,
    ListPage,
    UserPage,
  ],
  providers: [
    StatusBar,
    AndroidFullScreen,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HermesProvider,
    NativeProvider,
    VerifyProvider,
    OrderProvider,
    ShopProvider,
    UserProvider
  ]
})
export class AppModule {}
