import { Injectable } from '@angular/core';

import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

@Injectable()
export class ShopProvider {

  constructor(private hermes: HermesProvider) {
    console.log('Hello ShopServiceProvider Provider');
  }

  public getAllShopData() {
    return this.hermes.hermesQuery("forBuyerGetAllSeller_simplified.php", {
      nothing: "nothing"
    }).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '获取信息失败，请稍后重试', '确定');
          return data.querySuccess;
        } else {
          return data.queryResult;
        }
      })
    );
  }

  public getOneShopData(id) {
    return this.hermes.hermesQuery("forBuyerGetOneSeller.php", {
      sellerID: id,
    }).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '获取信息失败，请稍后重试', '确定');
          return data.querySuccess;
        } else {
          return data.queryResult[0];
        }
      })
    );
  }

}
