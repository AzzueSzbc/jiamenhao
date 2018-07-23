import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { NativeProvider } from '../native/native';
import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

@Injectable()
export class VerifyProvider {

  constructor(private hermes: HermesProvider,
    private nativePvd: NativeProvider,
    public events: Events) {
    console.log('Hello VerifyProvider Provider');
  }

  //token login app
  public tokenLogin(post) {
    return this.hermes.hermes('buyerTokenLogin.php', post).pipe(
      map((data) => {
        if (data.querySuccess==true) {
          this.nativePvd.setStorage('clienttoken', data.buyerToken);
        } else if (data.querySuccess==false) {
          this.hermes.presentAlert('提示信息', '身份验证过期，请重新登录', '确定');
        }
        return data.querySuccess;
      })
    );
  }

  //user register
  public register(post) {
    return this.hermes.hermesQueryNoData('buyerRegister.php', post).pipe(
      map((data) => {
        if (data.querySuccess == true) {
          this.hermes.presentToast('注册成功', 2000, 'bottom');
        } else if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '账户注册失败，请检查并重新填写', '确定');
        }
        return data.querySuccess;
      })
    );
  }

  //no token Login
  public noTokenLogin(post) {
    return this.hermes.hermes('buyerNoTokenLogin.php', post).pipe(
      map((data) => {
        if (data.querySuccess == true) {
          this.nativePvd.setStorage('clientid', data.buyerID);
          this.nativePvd.setStorage('clienttoken', data.buyerToken);
          this.events.publish('user:notokenlgoin', data.buyerID, data.buyerToken);
          this.hermes.presentToast('登陆成功', 2000, 'bottom');
        } else if (data.querySuccess == false) {
          this.hermes.presentAlert('提示信息', '账户或密码错误，请重新输入', '确定');
        }
        return data.querySuccess;
      })
    );
  }


}
