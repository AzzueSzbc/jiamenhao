import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { VerifyProvider } from '../../providers/verify/verify';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  registerForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private verifyPvd: VerifyProvider) {

    this.registerForm = this.formBuilder.group({
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

  get f() { return this.registerForm.controls; }

  securityCode: any = {
    securityCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  // 倒计时
  settime() {
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
      this.settime();
    }, 1000);
  }

  getCode() {
    if (this.registerForm.value.account == '') {
      let alert = this.alertCtrl.create({
        subTitle: '请填写手机号',
        buttons: ['确定']
      });
      alert.present();
      return;
    } else {
      this.verifyPvd.getRegisterSecurityCode({
        buyerAccount: this.registerForm.value.account
      })
      .subscribe((res) => {
        console.log(res);
      })
    }

    //发送验证码成功后开始倒计时

    this.securityCode.disable = false;
    this.settime();
  }

  registerSubmit(value: any) {
    let post = {
      buyerAccount: this.registerForm.value.account,
      buyerSecurityCode:  this.registerForm.value.securityCode,
    };
    if (this.registerForm.valid) {
      this.verifyPvd.register(post)
        .subscribe(
          (res) => {
            console.log("RegisterPage-registerSubmit-res:", res);
            if (res == true) {
              this.navCtrl.setRoot(TabsPage);
              this.navCtrl.popToRoot().then(() => {
                this.events.publish('user:login');
              });
            }
          },
          (err) => {
            console.log("RegisterPage-registerSubmit-err", err);
          });
    }
    console.log("register-form", this.registerForm.value);
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
