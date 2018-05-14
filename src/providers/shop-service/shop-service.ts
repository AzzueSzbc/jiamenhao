import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HermesProvider } from '../hermes/hermes';

@Injectable()
export class ShopServiceProvider {

  constructor(public http: HttpClient,
    public hermes: HermesProvider) {
    console.log('Hello ShopServiceProvider Provider');
  }

  public getAllShopData() {
    return this.hermes.hermes("forBuyerGetAllSeller_simplified.php", {
      nothing: "nothing"
    });
  }

  public getOneShopData(id) {
    return this.hermes.hermes("forBuyerGetOneSeller.php", {
      sellerID: id,
    });
  }

}
