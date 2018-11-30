import { Injectable } from '@angular/core';

import { NativeProvider } from '../native/native';
import { StorageProvider } from '../storage/storage';
import { HermesProvider } from '../hermes/hermes';
import { map, tap } from 'rxjs/operators';

//import { postBuyerPhone } from '../config';
//import { PostSecurityCode } from '../config';
//import { PostBuyerAccount } from '../config';

//interface PostGetSecurityCode extends postBuyerPhone {}
//interface PostBeginUsing extends PostSecurityCode, postBuyerPhone {}
//interface PostTokenLogin extends PostBuyerAccount {}

@Injectable()
export class VerifyProvider {

  constructor(private hermes: HermesProvider,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,) {
    console.log('Hello VerifyProvider Provider');
  }

  public getSecurityCode(account:string) {
    let post = {
      account: account
    }
    console.log("BuyerGetSecurityCode.php post", post);
    return this.hermes.hermes('BuyerGetSecurityCode.php', post);
  }

  public beginUsing(account:string, securityCode:string) {
    let post = {
      account: account,
      securityCode: securityCode
    }
    //console.log("BuyerBeginUsing.php post:", post);

    return this.hermes._hermes('BuyerBeginUsing.php', post).pipe(
      map((data) => {
        console.log("BuyerBeginUsing.php respondata:", data);
        if (data.loginSuccess == true) {
          this.storagePvd.setStorageAccount(parseInt(data.userID), data.token).then((val) => {
            console.log(val);
            this.nativePvd.presentSimpleToast('登陆成功');
          })
        } else if (data.loginSuccess == false) {
          this.nativePvd.presentSimpleAlert('验证码输入错误');
        }
        return data.loginSuccess;
      })
    )
  }

  //token login app
  public tokenLogin(userID: number, token: string) {
    let post = {
      userID: userID,
      token: token
    }
    console.log("tokenLogin post:", post);

    return this.hermes.hermes('BuyerTokenLogin.php', post).pipe(
      tap((data) => {
        console.log("tokenLogin data:", data);
        if (data.tokenVerifyPassed==true) {
          this.storagePvd.setStorageAccountToken(data.token).then((val) => {
            console.log(val);
          });
        } else if (data.tokenVerifyPassed==false) {
          this.nativePvd.presentSimpleAlert('身份验证过期，请重新登录');
          //this.storagePvd.removeStorageAccount();
        }
      }),
      map((data) => {
        if (data.tokenVerifyPassed==true) {
          return true;
        } else return false;
      })
    );
  }


}
