import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { VerifyProvider } from '../../providers/verify/verify';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  registerForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private verifyPvd: VerifyProvider) {

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerSubmit(value: any): void {
    if (this.registerForm.valid) {
      this.verifyPvd.register({
        buyerAccount: value.phoneNumber,
        buyerPasswordSHA: value.password,
        buyerUserName: value.username,
        buyerEmail: value.email,
      })
        .subscribe(
          (res) => {
            if (res == true) this.navCtrl.pop();
          },
          (err) => {
            console.log("register-provider-err", err);
          });
    }
    console.log("register-form", this.registerForm.value);
  }

}
