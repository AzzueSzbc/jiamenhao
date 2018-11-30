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

  /**
   * 获取所有店铺简单信息
   * @method getAllShopData
   * @return [description]
   */
  public getAllShopData() {
    return this.hermes.hermes("forBuyerGetAllSeller_simplified.php", {
      nothing: "nothing"
    }).pipe(
      map((data) => {
        if (!data.hasOwnProperty('queryResult')) {
          this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
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
   * 获取单个店铺分类信息
   * @method getOneShopData
   * @param  sellerID       商家ID
   * @return                [description]
   */
  public getOneShopData(sellerID: number) {
    let post = {
      sellerID: sellerID
    }
    console.log("forBuyerGetOneSeller.php post:", post);
    return this.hermes.hermes("forBuyerGetOneSeller.php", post).pipe(
      map((data) => {
        if (!data.hasOwnProperty('queryResult')) {
          this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
          return false;
        } else if (data.queryResult === false || data.queryResult === null || data.queryResult === [] || data.queryResult.length===0) {
          return null;
        } else if (data.queryResult) {
          return data.queryResult[0];
        }
      })
    );
  }

  /**
   * 获取单个店铺信息
   * @method getAllSellerComment
   * @param  id                  [description]
   * @return                     [description]
   */
  public getAllSellerComment(id) {
    return this.hermes.hermes('getAllSellerComment.php', {
      sellerID: id
    }).pipe(
      map(
        (data) => {
          if (!data.hasOwnProperty('queryResult')) {
            this.nativePvd.presentSimpleAlert('加载失败，请稍后重试');
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

}
