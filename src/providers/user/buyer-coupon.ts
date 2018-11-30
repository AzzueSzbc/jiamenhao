import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { NativeProvider } from '../native/native';
import { HermesProvider } from '../hermes/hermes';

@Injectable()
export class CouponProvider {

  constructor(public hermes: HermesProvider,
    private nativePvd: NativeProvider) {
    console.log('Hello CouponProvider Provider');
  }

  /**
   * 查询优惠券
   */
  public getCoupon(post) {
    return this.hermes.hermes('getCoupon.php', post).pipe(
      map((data) => {
        if (data.businessStatus.tokenVerifyPassed==false) {
          this.nativePvd.presentSimpleAlert('还未登录，请登录');
          return false;
        } else if (!data.hasOwnProperty('queryResult')) {
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          return null;
        } else if (data.queryResult) {
          return data.queryResult;
        }
      })
    );
  }
}
