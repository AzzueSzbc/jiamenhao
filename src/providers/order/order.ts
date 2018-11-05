import { Injectable } from '@angular/core';

import { NativeProvider } from '..//native/native';
import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

//支付订单发送数据
interface postPayOrder {
  buyerID: number,
  buyerToken: string,
  ordersID: number,
  couponID: number
}

@Injectable()
export class OrderProvider {

  constructor(private nativePvd: NativeProvider,
    private hermes: HermesProvider) {
    console.log('Hello OrderServiceProvider Provider');
  }

  public submitOrderData(post) {
    return this.hermes.hermes("addNewOrder.php", post).pipe(
      map((data) => {
        if (data.querySuccess == false){
          this.nativePvd.presentSimpleAlert('提交订单失败，请检查并重试')
          return false;
        } else if (!data.hasOwnProperty('queryResult')) {
          this.nativePvd.presentSimpleAlert('提交订单失败，请检查并重试')
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          this.nativePvd.presentSimpleAlert('提交订单出现错误')
          return null;
        } else if (data.queryResult) {
          return data.queryResult;
        }
      })
    );
  }

  public payOrder(post) {
    return this.hermes.hermesString('payOrder.php', post).pipe(
      map((data) => {
        return this.unescapeHTML(data);
      })
    );
  }
  unescapeHTML(a){
  let aNew = "" + a;
     return aNew.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
 }

  public getAllOrder(post) {
    return this.hermes.hermes("getOrder_buyer_simplified.php", post).pipe(
      map((data) => {
        console.log("getAllOrder data:", data);
        //alert("getAllOrder data:"+JSON.stringify(data));
        if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
          return false;
        } else if (!data.hasOwnProperty('queryResult')) {
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === [] || data.queryResult.length === 0) {
          return null;
        } else if (data.queryResult) {
          return data.queryResult;
        }
      })
    );
  }

  public getOneOrder(post) {
    return this.hermes.hermes('getOneOrder_buyer.php', post).pipe(
      map(
        (data) => {
          if (data.querySuccess == false) {
            this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
            return false;
          } else if (!data.hasOwnProperty('queryResult')) {
            return false;
          } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
            return null;
          } else if (data.queryResult) {
            return data.queryResult;
          }
        }
      )
    )
  }

  public commentsOrder(post) {
    return this.hermes.hermes('buyerCommentsOrder.php', post).pipe(
      map(
        (data) => {
          if (data.querySuccess == false) {
            this.nativePvd.presentSimpleAlert('评价失败，请检查并重新填写');
          }
          return data.querySuccess;
        }
      )
    );
  }

  commentsRider(post) {
    return this.hermes.hermes('buyerCommentsRider.php', post).pipe(
      map(
        (data) => {
          if (data.querySuccess == false) {
            this.nativePvd.presentSimpleAlert('评价失败，请检查并重新填写');
          }
          return data.querySuccess;
        }
      )
    );
  }

}
