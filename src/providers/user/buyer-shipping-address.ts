import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { NativeProvider } from '../native/native';
import { HermesProvider } from '../hermes/hermes';

//import { PostBuyerAccount } from '../config';
//import { PostBuyerShippingAddressID } from '../config';
//import { PostBuyerShippingAddress } from '../config';

@Injectable()
export class ShippingAddressProvider {

  constructor(public hermes: HermesProvider,
    private nativePvd: NativeProvider,) {
    console.log('Hello ShippingAddressProvider Provider');
  }

  /**
   * 查询单个收货地址信息（使用地址信息ID）
   */
  public getShippingAddressByID(post) {
    //console.log("getShippingAddressByID_buyer.php post:", post);
    return this.hermes.hermes("getShippingAddressByID_buyer.php", post).pipe(
      map((data) => {
        //console.log("UserProvider getOneShippingAddress data:", data);
        if (data.tokenVerifyPassed == false) {
          this.nativePvd.presentSimpleToast('还未登录账号，请确认登录');
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          return null;
        } else if (data.queryResult) {
          return data.queryResult;
        }
      })
    );
  }

  /**
   * 查询买家所有收货地址
   */
  public getBuyerShippingAddress(post) {
    return this.hermes.hermes('getBuyerShippingAddress.php', post).pipe(
      map((data) => {
        if (data.tokenVerifyPassed == false) {
          this.nativePvd.presentSimpleToast('还未登录账号，请确认登录');
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          return null;
        } else if (data.queryResult) {
          return data.queryResult;
        }
      })
    );
  }

  /**
   * 增加买家收货地址
   * @method addNewShippingAddress
   * @param  post                  [description]
   * @return                       [description]
   */
  public addNewShippingAddress(post) {
    return this.hermes.hermes('addNewShippingAddress_buyer.php', post).pipe(
      map((data) => {
        if (data.tokenVerifyPassed == false) {
          this.nativePvd.presentSimpleAlert('用户登录信息过期，请重新登录');
        }
        return data.tokenVerifyPassed;
      })
    );
  }

  /**
   * 修改买家收货地址
   * @method modifyShippingAddress
   * @param  post                  [description]
   * @return                       [description]
   */
  public buyerModifyShippingAddress(post) {
    return this.hermes.hermes('buyerModifyShippingAddress.php', post).pipe(
      map((data) => {
        if (data.tokenVerifyPassed == false) {
          this.nativePvd.presentSimpleAlert('用户登录信息过期，请重新登陆');
        }
        return data.tokenVerifyPassed;
      })
    )
  }
}
