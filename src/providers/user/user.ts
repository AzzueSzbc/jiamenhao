import { Injectable } from '@angular/core';

import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

@Injectable()
export class UserProvider {

  constructor(public hermes: HermesProvider) {
    console.log('Hello UserServiceProvider Provider');
  }

  public getUserBasicData(post) {
    return this.hermes.hermesQuery("getBuyerBasicInformation.php", post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '用户身份验证过期，请重新登录', '确定');
          return data.querySuccess;
        } else if (data.queryResult == false || data.queryResult == null){
          return null;
        } else if (data.queryResult) {
          return data.queryResult[0];
        }
      })
    );
  }

  public getOneShippingAddress(post) {
    return this.hermes.hermesQuery("getShippingAddressByID_buyer.php", post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '用户身份验证过期，请重新登录', '确定');
          return data.querySuccess;
        } else {
          return data.queryResult[0];
        }
      })
    );
  }

  public getAllShippingAddress(post) {
    return this.hermes.hermesQuery('getBuyerShippingAddress.php', post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '用户身份验证过期，请重新登录', '确定');
          return data.querySuccess;
        } else {
          return data.queryResult;
        }
      })
    );
  }

  public addNewShippingAddress(post) {
    return this.hermes.hermesQuery('addNewShippingAddress_buyer.php', post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '提交错误，可能由于用户登录信息过期，或表单填写错误', '确定');
        }
        return data.querySuccess;
      })
    );
  }


}
