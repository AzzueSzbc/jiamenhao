import { Injectable } from '@angular/core';

import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderProvider {

  constructor(private hermes: HermesProvider) {
    console.log('Hello OrderServiceProvider Provider');
  }

  public submitOrderData(post) {
    return this.hermes.hermesQueryNoData("addNewOrder.php", post).pipe(
      map((data) => {
        if (data.querySuccess == false){
          this.hermes.presentAlert('提示信息', '提交订单失败，请检查填写并重试', '确定')
        }
        return data.querySuccess;
      })
    );
  }

  public getAllOrder(post) {
    return this.hermes.hermes("getOrder_buyer_simplified.php", post).pipe(
      map((data) => {
        if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '用户身份验证过期，请重新登录', '确定');
          return data.querySuccess;
        }
        else return data.queryResult;
      })
    );
  }
}
