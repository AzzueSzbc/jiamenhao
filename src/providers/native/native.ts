import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class NativeProvider {

  constructor(public http: HttpClient,
    private storage: Storage) {
    console.log('Hello NativeProvider Provider');
  }

  warn(info): void {
    console.log('%cNativeService/' + info, 'color:#e8c406');
  }

  /**
   * Storage
   */

  setStorage(key: any, value: any) {
    this.storage.set(key, value);
  }

  getStorage(key: any): Promise<any> {
    return new Promise((resolve) => {
      this.storage.get(key).then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('getStorage:' + err);
      });
    });
  }

  removeStorage(key: any) {
    this.storage.remove(key);
  }

}
