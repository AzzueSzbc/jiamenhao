import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { NativeProvider } from '..//native/native';
import { HermesProvider } from '../hermes/hermes';

//import { PostBuyerAccount } from '../config';
//import { PostPurchaseOrderID } from '../config';

//支付订单发送数据
//interface PostPayOrder extends PostBuyerAccount,PostPurchaseOrderID {}

@Injectable()
export class OrderProvider {

  constructor(private nativePvd: NativeProvider,
    private hermes: HermesProvider) {
  }

  /**
   * 增加新订单
   * @method addNewOrder
   * @param  post        [description]
   * @return             [description]
   */
  public addNewOrder(post) {
    return this.hermes.hermes("safeAddNewOrder.php", post).pipe(
      map((data) => {
        //alert("http返回:" + JSON.stringify(data));
        if (data.tokenVerifyPassed == false) {
          this.nativePvd.presentSimpleAlert('身份验证过期，请重新登录')
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === []) {
          this.nativePvd.presentSimpleAlert('提交订单出现错误')
          return null;
        } else if (data.queryResult) {
          return data.queryResult;
        } else {
          this.nativePvd.presentSimpleAlert('提交订单出现错误')
          return false;
        }
      })
    );
  }

  /**
   * 支付宝支付订单
   * @method payOrder
   * @param  userID    买家ID
   * @param  token 买家token
   * @param  purchaseOrderID   订单ID
   * @param  couponID   优惠卷ID
   * @return            observable（支付字符串或空字符串）
   */
  public payPurchaseOrderByAlipay(userID: number, token: string, purchaseOrderID: number) {
    let post = {
      userID: userID,
      token: token,
      purchaseOrderID: purchaseOrderID,
    }
    console.log("payPurchaseOrderByAlipay.php post:", post);
    return this.hermes.hermes('payPurchaseOrderByAlipay.php', post).pipe(
      map((data) => {
        //alert("payOrder data:" + JSON.stringify(data));
        if (data.tokenVerifyPassed == true) {
          if (data.payContent != "" && data.payContent) {
            return this.unescapeHTML(data.payContent);
          } else return null;
        } else {
          this.nativePvd.presentSimpleAlert("支付失败");
          return null;
        }
      })
    );
  }
  unescapeHTML(a) {
    let aNew = "" + a;
    return aNew.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }

  /**
   * 微信支付订单
   * @method payPurchaseOrderByWeChat
   * @param  userID    买家ID
   * @param  token 买家token
   * @param  purchaseOrderID   订单ID
   * @param  couponID   优惠卷ID
   * @return            observable（支付字符串或空字符串）
   */
  public payPurchaseOrderByWeChat(userID: number, token: string, purchaseOrderID: number) {
    let post = {
      userID : userID,
      token : token,
      purchaseOrderID : purchaseOrderID
    };
    console.log("payPurchaseOrderByWeChat.php post:", post);
    return this.hermes.hermes('payPurchaseOrderByWeChat.php', post).pipe(
      map((data) => {
        //alert("payOrder data:" + JSON.stringify(data));
        if (data.tokenVerifyPassed == true) {
          if (data.payContent) {
            return data.payContent;
          } else return null;
        } else {
          this.nativePvd.presentSimpleAlert("支付失败");
          return null;
        }
      })
    );
  }

  /**
  * 简化的查询所有订单（使用买家ID）
  * @method getAllOrder
  * @param  post        [description]
  * @return             [description]
  */
  public getAllOrder(post) {
    return this.hermes.hermes("getOrder_buyer_simplified.php", post).pipe(
      map((data) => {
        console.log("getAllOrder data:", data);
        //alert("getAllOrder data:"+JSON.stringify(data));
        if (data.tokenVerifyPassed == false) {
          this.nativePvd.presentSimpleToast('还没登录，请先登录');
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === [] || data.queryResult.length === 0) {
          return null;
        } else if (data.queryResult) {
          return data.queryResult;
        }
      })
    );
  }

  /**
   * 查询买家单个订单（使用买家ID）
   * @method getOneOrder
   * @param  post        [description]
   * @return             [description]
   */
  public getOneOrder(post) {
    return this.hermes.hermes('getOneOrder_buyer.php', post).pipe(
      map(
        (data) => {
          //alert("data:" + JSON.stringify(data));
          if (data.tokenVerifyPassed == false) {
            this.nativePvd.presentSimpleToast('身份验证过期，请重新登录');
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

  /**
   * 买家评论订单
   * @method commentsOrder
   * @param  post          [description]
   * @return               [description]
   */
  public commentsOrder(post) {
    return this.hermes.hermes('buyerCommentsOrder.php', post).pipe(
      map(
        (data) => {
          if (data.tokenVerifyPassed == false) {
            this.nativePvd.presentSimpleToast('身份验证过期，请重新登录');
          }
          return data.tokenVerifyPassed;
        }
      )
    );
  }

  /**
   * 买家评价骑手的单次配送
   * @method commentsRider
   * @param  post          [description]
   * @return               [description]
   */
  commentsRider(post) {
    return this.hermes.hermes('buyerCommentsRider.php', post).pipe(
      map(
        (data) => {
          if (data.tokenVerifyPassed == false) {
            this.nativePvd.presentSimpleToast('身份验证过期，请重新登录');
          }
          return data.tokenVerifyPassed;
        }
      )
    );
  }

}
