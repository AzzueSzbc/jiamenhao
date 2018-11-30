import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-my-invitation',
  templateUrl: 'my-invitation.html',
})
export class MyInvitationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyInvitationPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
