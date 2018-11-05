import { Injectable } from '@angular/core';

import { NativeProvider } from '..//native/native';
import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

@Injectable()
export class ShopProvider {

  constructor(private hermes: HermesProvider,
    private nativePvd: NativeProvider) {
    console.log('Hello ShopServiceProvider Provider');
  }

  public getAllShopData() {
    return this.hermes.hermes("forBuyerGetAllSeller_simplified.php", {
      nothing: "nothing"
    }).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
          return false;
        } else if (!data.hasOwnProperty('queryResult')) {
          return false;
        } else if (data.queryResult) {
          return data.queryResult;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          return null;
        }
      })
    );
  }

  public getOneShopData(id) {
    return this.hermes.hermes("forBuyerGetOneSeller.php", {
      sellerID: id,
    }).pipe(
      map((data) => {
          if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
          return false;
        } else if (!data.hasOwnProperty('queryResult')) {
          return false;
        } else if (data.queryResult) {
          return data.queryResult[0];
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          return null;
        }
      })
    );
  }

  public getAllSellerComment(id) {
    return this.hermes.hermes('getAllSellerComment.php', {
      sellerID: id
    }).pipe(
      map(
        (data) => {
          if (data.querySuccess == false) {
            this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
            return false;
          } else if (!data.hasOwnProperty('queryResult')) {
            return false;
          } else if (data.queryResult) {
            return data.queryResult;
          } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
            return null;
          }
        }
      )
    )
  }

}
