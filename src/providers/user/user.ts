import { Injectable } from '@angular/core';

import { NativeProvider } from '../native/native';
import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

@Injectable()
export class UserProvider {

  constructor(public hermes: HermesProvider,
    private nativePvd: NativeProvider,) {
    console.log('Hello UserServiceProvider Provider');
  }


  public getUserBasicData(post) {
    return this.hermes.hermes("getBuyerBasicInformation.php", post).pipe(
      map((data) => {
        console.log("getUserBasicData data:", data);
        if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('用户身份验证过期，请重新登录');
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

  public getCoupon(post) {
    return this.hermes.hermes('getCoupon.php', post).pipe(
      map((data) => {
        if (data.businessStatus.tokenVerifyPassed==false) {
          this.nativePvd.presentSimpleAlert('用户身份验证过期，请重新登录');
          return false;
        } else if (data.systemStatus.querySuccess==false) {
          this.nativePvd.presentSimpleAlert('加载失败，请检查网络连接');
          return false;
        } else if (!data.hasOwnProperty('queryResult')) {
          return false;
        } else if (data.queryResult) {
          return data.queryResult;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          return null;
        }
      })
    )
  }

  public useCoupon(post) {
    return this.hermes.hermes('useCoupon.php', post).pipe(
      map((data) => {
        if (data.systemStatus.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('用户身份验证过期，请重新登录');
          return false;
        } else if (data.systemStatus.querySuccess == true) {
          return true;
        }
      })
    );
  }

  public getOneShippingAddress(post) {
    return this.hermes.hermes("getShippingAddressByID_buyer.php", post).pipe(
      map((data) => {
        console.log("UserProvider getOneShippingAddress data:", data);
        if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('用户身份验证过期，请重新登录');
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

  public getAllShippingAddress(post) {
    return this.hermes.hermes('getBuyerShippingAddress.php', post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('用户身份验证过期，请重新登录');
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

  public addNewShippingAddress(post) {
    return this.hermes.hermes('addNewShippingAddress_buyer.php', post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('提交错误，可能由于用户登录信息过期，或表单填写错误');
        }
        return data.querySuccess;
      })
    );
  }

  public modifyShippingAddress(post) {
    return this.hermes.hermes('buyerModifyShippingAddress.php', post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('提交错误，可能由于用户登录信息过期，或表单填写错误');
        }
        return data.querySuccess;
      })
    )
  }
}
