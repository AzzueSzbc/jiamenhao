import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { NativeProvider } from '../../providers/native/native';

import { HomePage } from '../home/home';
import { CartPage } from '../cart/cart';
import { DeliverPage } from '../deliver/deliver';
import { ListPage } from '../list/list';
import { UserPage } from '../user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  shopNumber: number = 0;

  tab1Root = HomePage;
  tab2Root = CartPage;
  tab3Root = DeliverPage;
  tab4Root = ListPage;
  tab5Root = UserPage;

  constructor(private events: Events,
    private nativePvd: NativeProvider) {
      this.calculate();
      this.events.subscribe('shopping cart change', () => {
        this.calculate();
      });
    }

  ionViewDidLoad() {

  }

  calculate() {
    this.shopNumber = 0;
    this.nativePvd.getStorage('shopping cart').then((val) => {
      if(val) {
        for (let i in val) {
          val[i].commodites.forEach((c) => {
            this.shopNumber = this.shopNumber + c.productAmount;
          })
        }
        console.log("val:", val);
        console.log("shopNumber:", this.shopNumber);
      }
    })
  }

}
