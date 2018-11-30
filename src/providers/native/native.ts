import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

declare var cordova: any;

@Injectable()
export class NativeProvider {

  constructor(public http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private network: Network) {
    console.log('Hello NativeProvider Provider');
  }

  /**
   * 百度地图定位
   * @method baidumap_location
   * @return [description]
   */
  baidumap_location(): Promise<any> {
    return new Promise((resolve, reject) => {
      cordova.plugins.baidumap_location.getCurrentPosition((result) => {
        //this.location = (result.locationDescribe).replace('在', '');
        let location = {
          latitude: result.latitude,
          longitude: result.longitude
        }
        this.setStorage('location', location);
        //alert(JSON.stringify(result, null, 4));
        resolve(result);
        //console.log("================")
        //console.log(JSON.stringify(result, null, 4));
      }, (error) => {
        //alert(JSON.stringify(error));
        //this.location = "无法获得当前位置";
        reject(error);
      });
    });
  }

  warn(info): void {
    console.log('%cNativeService/' + info, 'color:#e8c406');
  }

  //Storage
  /**
   * 设置缓存
   * @method setStorage
   * @param  key        缓存键
   * @param  value      缓存值
   */
  setStorage(key: any, value: any): Promise<any> {
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
  getStorage(key: any): Promise<any> {
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
  removeStorage(key: any): Promise<any> {
    return new Promise((resolve) => {
      this.storage.remove(key).then((value) => {
        resolve(value);
      }).catch(err => {
        this.warn('getStorage:' + err);
      });
    });
  }

  /**
   * 检测网络是否存在
   * @method detectNetwork
   * @param  have          网络存在时执行的函数
   * @param  no            网络不存在时执行的函数
   * @return               [description]
   */
  detectNetwork(have: () => void, no: () => void) {
    if (this.network.type == "none") {
      no();
    } else {
      have();
    }
  }

  /**
   * 简单的alert组件使用封装
   * @method presentSimpleAlert
   * @param  message            主要提示信息
   * @param  title              标题
   * @param  buttons            按钮（只有一个，一般为确定）
   */
  public presentSimpleAlert(message: string, title: string = '提示信息', buttons: string = '确定') {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [buttons]
    });
    alert.present();
  }

  /**
   * 简单的toast组件使用封装
   * @method presentSimpleToast
   * @param  message            主要提示信息
   * @param  duration           持续时间
   * @param  position           位置:"top", "middle", "bottom".
   */
  public presentSimpleToast(message: string, duration: number = 2000, position: string = 'bottom') {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });
    toast.present();
  }

}
