import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { VerifyProvider } from '../../providers/verify/verify';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private verifyPvd: VerifyProvider) {
      this.loginForm = this.formBuilder.group({
        account: ['', [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^1[0-9]{10}$/)
          ]],
        securityCode: ['', [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          ]],
      });
  }

  get f() { return this.loginForm.controls; }

  securityCode: any = {
    securityCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  // 倒计时
  setTime() {
    if (this.securityCode.countdown == 1) {
      this.securityCode.countdown = 60;
      this.securityCode.securityCodeTips = "获取验证码";
      this.securityCode.disable = true;
      return;
    } else {
      this.securityCode.countdown--;
    }

    this.securityCode.securityCodeTips = "重新获取(" + this.securityCode.countdown + ")";
    setTimeout(() => {
      this.securityCode.securityCodeTips = "重新获取(" + this.securityCode.countdown + ")";
      this.setTime();
    }, 1000);
  }
  getCode() {
    if (this.loginForm.value.account == '') {
      let alert = this.alertCtrl.create({
        subTitle: '请填写手机号',
        buttons: ['确定']
      });
      alert.present();
      return;
    } else {
      this.verifyPvd.getSecurityCode(this.loginForm.value.account).subscribe(
        (res) => {
          console.log(res);
        }, (err) => {
          console.log(err);
        }
      );
    }
    //发送验证码成功后开始倒计时
    this.securityCode.disable = false;
    this.setTime();
  }

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.verifyPvd.beginUsing(this.loginForm.value.account, this.loginForm.value.securityCode)
        .subscribe(
          (res) => {
            if (res == true) {
              this.navCtrl.pop().then(() => {
                this.events.publish('user:login');
              });

            }
            else if (res == false) {
              loading.dismiss();
            }
          },
          (err) => {
            console.log("login-provider-err", err);
          });
      let loading = this.loadingCtrl.create({
        content: '正在登陆中，请稍后...',
        dismissOnPageChange: true
      });
      loading.present();
    }
    console.log("login-form", this.loginForm.value);
  }

  pushResetPassword() {
    console.log('Reset password clicked');
  }

  pushRegisterPage() {
    this.navCtrl.push('RegisterPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
