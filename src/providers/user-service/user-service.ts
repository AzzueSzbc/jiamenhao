import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HermesProvider } from '../hermes/hermes';
import 'rxjs/add/operator/map';

@Injectable()
export class UserServiceProvider {

  constructor(public http: HttpClient,
    public hermes: HermesProvider,
    private alertCtrl: AlertController,) {
    console.log('Hello UserServiceProvider Provider');
  }

  public getUserBasicData(data) {
    return this.hermes.hermes("getBuyerBasicInformation.php", data).map((res) => {
      if(res.querySuccess==false) {
        let alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle: '用户身份验证过期，请重新登录',
          buttons: ['确定']
        });
        alert.present();
      }
      return res;
    });
  }
}
