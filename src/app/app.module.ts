import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { UserPage } from '../pages/user/user';

import { ShopPage } from '../pages/shop/shop';
import { GoodsPage } from '../pages/goods/goods';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
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
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    ShopPage,
    GoodsPage,
    ListPage,
    UserPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
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
