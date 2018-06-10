import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class HermesProvider {

  public hostsURL: string = 'http://120.78.220.83:22781/';

  constructor(public http: HttpClient,
    private alertCtrl: AlertController,
    private storage: Storage) {
    console.log('Hello HermesProvider Provider');
  }

  public hermes(link, data): Observable<any> {
    return this.http.post<any>(this.hostsURL + link, JSON.stringify(data));
  }

  //有token登录
  public tokenLogin(data) {
    return this.hermes("buyerTokenLogin.php", data).map((res) => {
      if (res.querySuccess) {
        //成功登录
        this.storage.set('clienttoken', res.buyerToken);
      }//程序错误
      else {
        let alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle: '用户身份验证过期，请重新登录',
          buttons: ['确定']
        });
        alert.present();
      }
      return res.querySuccess;
    });
  }
  //token验证
  public tokentokenVerify(data) {
    return this.hermes("buyerTokenLogin.php", data);
  }

}
