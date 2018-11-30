import { Injectable } from '@angular/core';

declare var Wechat: any;  // 此处声明plugin.xml中clobbers对应的值

export interface WechatPayParam {
  partnerid: string;
  prepayid: string;
  noncestr: string;
  timestamp: string;
  sign: string;
}

@Injectable()
export class WechatProvider {

  constructor() { }

  pay(params: WechatPayParam, success: () => void, failed: () => void) {
    Wechat.sendPaymentRequest(params, () => {
      //支付成功
      alert("支付成功");
      success();
    }, (reason) => {
      //支付失败
      alert("支付失败");
      failed();
    });
  }

  check() {
    Wechat.isInstalled((installed) => {
      alert("Wechat installed: " + (installed ? "Yes" : "No"));
    }, (reason) => {
      alert("Failed: " + reason);
    });
  }

  testAuthenticate() {
    let scope = "snsapi_userinfo",
      state = "_" + (+new Date());
    Wechat.auth(scope, state, (response) => {
      // you may use response.code to get the access token.
      alert(JSON.stringify(response));
    }, (reason) => {
      alert("Failed: " + reason);
    });
  }

  testShare() {
    Wechat.share({
      text: "This is just a plain string",
      scene: Wechat.Scene.SESSION   // share to Timeline
    }, () => {
      alert("Success");
    }, (reason) => {
      alert("Failed: " + reason);
    });
  }

}
