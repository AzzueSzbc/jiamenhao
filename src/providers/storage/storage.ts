import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

interface buyerAccount {
  userID: number,
  token: string,
  defaultAddressID: number
}

@Injectable()
export class StorageProvider {

  constructor(private storage: Storage) {}

  /**
   * 设置买家账号本地缓存
   * @method setStorageAccount
   * @param  userID               买家ID
   * @param  token            买家token
   * @param  buyerDefaultAddressID 买家默认地址ID
   * @return                       promise
   */
  public setStorageAccount(userID: number, token: string, defaultAddressID: number = -1): Promise<buyerAccount> {
    let buyer:buyerAccount = {
      userID: userID,
      token: token,
      defaultAddressID: defaultAddressID
    }
    return new Promise((resolve) => {
      this.storage.set('buyer account', buyer).then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('setStorageAccount:' + err);
      });
    });
  }

  /**
   * 设置买家账号本地缓存的token
   * @method setStorageAccountToken
   * @param  token                  token
   * @return                        promise
   */
  public setStorageAccountToken(token: string): Promise<buyerAccount> {
    return new Promise((resolve) => {
      this.getStorage('buyer account').then((buyer) => {
        console.log("buyer account:", buyer);
        buyer.token = token;
        console.log("buyer account after:", buyer);
        this.setStorage('buyer account', buyer).then((value) => {
          resolve(value);
        })
      }).catch(err => {
        this.warn('setStorageAccountToken:' + err);
      });
    });
  }

  /**
   * 设置买家账号本地缓存的默认地址ID
   * @method setStorageAccountDefaultAddressID
   * @param  defaultAddressID                  默认地址ID
   * @return                                   promise
   */
  public setStorageAccountDefaultAddressID(defaultAddressID: number): Promise<buyerAccount> {
    return new Promise((resolve) => {
      this.getStorage('buyer account').then((buyer) => {
        buyer.defaultAddressID = defaultAddressID;
        this.setStorage('buyer account', buyer).then((value) => {
          resolve(value);
        })
      }).catch(err => {
        this.warn('setStorageAccountToken:' + err);
      });
    });
  }

  /**
   * 获取买家账号本地缓存
   * @method getStorageAccount
   * @return promise
   */
  public getStorageAccount(): Promise<buyerAccount> {
    return new Promise((resolve) => {
      this.getStorage('buyer account').then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('getStorageAccount:' + err);
      });
    })
  }

  /**
   * 移除买家账号本地缓存
   * @method removeStorageAccount
   * @return promise
   */
  public removeStorageAccount(): Promise<buyerAccount> {
    return new Promise((resolve) => {
      this.removeStorage('buyer account').then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('getStorageAccount:' + err);
      });
    })
  }

  /**
   * 设置缓存
   * @method setStorage
   * @param  key        缓存键
   * @param  value      缓存值
   */
  private setStorage(key: any, value: any): Promise<any> {
    return new Promise((resolve) => {
      this.storage.set(key, value).then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('getStorage:' + err);
      });
    });
  }

  /**
   * 读取缓存
   * @method getStorage
   * @param  key        缓存键
   * @return            promise
   */
  private getStorage(key: any): Promise<any> {
    return new Promise((resolve) => {
      this.storage.get(key).then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('getStorage:' + err);
      });
    });
  }

  /**
   * 删除缓存
   * @method removeStorage
   * @param  key           缓存键
   */
  private removeStorage(key: any): Promise<any> {
    return new Promise((resolve) => {
      this.storage.remove(key).then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('getStorage:' + err);
      });
    });
  }

  warn(info): void {
    console.log('%cNativeService/' + info, 'color:#e8c406');
  }
}
