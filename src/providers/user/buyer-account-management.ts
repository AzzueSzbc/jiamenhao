import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { NativeProvider } from '../native/native';
import { HermesProvider } from '../hermes/hermes';

@Injectable()
export class BuyerAccountManagementProvider {

  constructor(public hermes: HermesProvider,
    private nativePvd: NativeProvider) {
    console.log('Hello BuyerAccountManagementProvider Provider');
  }

  getBuyerBasicInformation(post) {
    return this.hermes.hermes("getBuyerBasicInformation.php", post).pipe(
      map((data) => {
        console.log("getUserBasicData data:", data);
        if (data.tokenVerifyPassed == false) {
          this.nativePvd.presentSimpleAlert('还未登录，请登录');
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          return null;
        } else if (data.queryResult) {
          return data.queryResult['0'];
        }
      })
    );
  }
}
