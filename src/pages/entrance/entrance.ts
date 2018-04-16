import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login'
import { RegisterPage } from '../register/register'

@IonicPage()
@Component({
  selector: 'page-entrance',
  templateUrl: 'entrance.html',
})
export class EntrancePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntrancePage');
  }

  goToLoginPage(){
    this.navCtrl.push(LoginPage);
  }

  goToRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }
}
