import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CartPage } from '../cart/cart';
import { DeliverPage } from '../deliver/deliver';
import { ListPage } from '../list/list';
import { UserPage } from '../user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CartPage;
  tab3Root = DeliverPage;
  tab4Root = ListPage;
  tab5Root = UserPage;

  constructor() {}

}
