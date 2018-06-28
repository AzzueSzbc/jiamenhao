import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { VerifyProvider } from '../../providers/verify/verify';

import { TabsPage } from '../tabs/tabs';

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
    private formBuilder: FormBuilder,
    private verifyPvd: VerifyProvider) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginSubmit(value: any): void {
    if (this.loginForm.valid) {
      this.verifyPvd.noTokenLogin({
        buyerAccount: value.username,
        buyerPasswordSHA: value.password
      })
        .subscribe(
          (res) => {
            if (res == true) {
              this.navCtrl.setRoot(TabsPage);
              this.navCtrl.popToRoot();
            }
            else if (res == false) {
              loading.dismiss();
            }
          },
          (err) => {
            console.log("login-provider-err", err);
          });

      let loading = this.loadingCtrl.create({
        content: '急毛啊没做完啊登陆页面都做了好久啊！',
        dismissOnPageChange: true
      });
      loading.present();
    }
    console.log("login-form", this.loginForm.value);
  }

}
