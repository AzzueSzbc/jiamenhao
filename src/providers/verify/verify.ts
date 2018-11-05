import { Injectable } from '@angular/core';

import { NativeProvider } from '../native/native';
import { HermesProvider } from '../hermes/hermes';
import { map } from 'rxjs/operators';

@Injectable()
export class VerifyProvider {

  constructor(private hermes: HermesProvider,
    private nativePvd: NativeProvider,) {
    console.log('Hello VerifyProvider Provider');
  }

  //token login app
  public tokenLogin(post) {
    return this.hermes.hermes('buyerTokenLogin.php', post).pipe(
      map((data) => {
        if (data.querySuccess==true) {
          this.nativePvd.setStorage('clienttoken', data.buyerToken);
          return true;
        } else if (data.querySuccess==false) {
          this.nativePvd.presentSimpleAlert('身份验证过期，请重新登录');
          return false;
        }
      })
    );
  }

  //get register security code
  getRegisterSecurityCode(post) {
    return this.hermes.hermes('getRegisterSecurityCode_buyer.php', post).pipe(
      map((data) => {
        if (data.queryStatus.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('查询失败，请稍后重试');
          return false;
        } else if (data.queryStatus.querySuccess ==true) {
          if (data.queryStatus.accountStatus == "已注册") {
            this.nativePvd.presentSimpleAlert('该手机号已被注册请直接登录');
            return false;
          } else {
            return true;
          }
        }
      })
    );
  }

  //user register
  public register(post) {
    return this.hermes.hermes('buyerRegister.php', post).pipe(
      map((data) => {
        console.log('VerifyProvider-register-res:', data);
        if (data.queryStatus.querySuccess == true) {
          if (data.queryStatus.hasPassedSecurityCodeVerify == true) {
            this.nativePvd.setStorage('clientid', data.queryResult.buyerID);
            this.nativePvd.setStorage('clienttoken', data.queryResult.buyerToken);
            this.nativePvd.presentSimpleToast('注册成功');
            return true;
          } else if (data.queryStatus.hasPassedSecurityCodeVerify == false) {
            this.nativePvd.presentSimpleAlert('验证码错误，请重新输入');
            return false;
          }
        } else if (data.queryStatus.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('发生了一些问题，不是我们的错QAQ');
          return false;
        }
      })
    );
  }

  getLoginSecurityCode(post) {
    return this.hermes.hermes('getLoginSecurityCode_buyer.php', post).pipe(
      map((data) => {
        if (data.queryStatus.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('查询失败，请稍后重试');
          return false;
        } else if (data.queryStatus.querySuccess ==true) {
          if (data.queryStatus.accountStatus == "尚未注册") {
            this.nativePvd.presentSimpleAlert('该手机号尚未注册请先注册账号');
            return false;
          } else {
            return true;
          }
        }
      })
    );
  }

  //no token Login
  public noTokenLogin(post) {
    return this.hermes.hermes('buyerNoTokenLogin.php', post).pipe(
      map((data) => {
        console.log("noTokenLogin-respondata:", data);
        if (data.querySuccess == true) {
          this.nativePvd.setStorage('clientid', data.buyerID);
          this.nativePvd.setStorage('clienttoken', data.buyerToken);
          this.nativePvd.presentSimpleToast('登陆成功');
        } else if (data.querySuccess == false) {
          this.nativePvd.presentSimpleAlert('验证码输入错误，或该手机号未注册家门好');
        }
        return data.querySuccess;
      })
    );
  }

}
