import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../../providers/native/native';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-choose-address',
  templateUrl: 'choose-address.html',
})
export class ChooseAddressPage {

  addressData: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativePvd: NativeProvider,
    private userPvd: UserProvider) {
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseAddressPage');
  }

  refreshDisplay() {
    this.nativePvd.getStorage('clientid').then((id) => {
      this.nativePvd.getStorage('clienttoken').then((token) => {
        this.userPvd.getAllShippingAddress({
          buyerID: id,
          buyerToken: token
        })
          .subscribe(
            (res) => {
              if (res) {
                this.addressData = res;
              }
            },
            (err) => {
              console.log('get-all-address', err);
            }
          )
      });
    });
  }

  selectAddress(id) {
    this.nativePvd.setStorage("addressid", id);
    this.navCtrl.pop();
  }

  pushAddAddress() {
    this.navCtrl.push('AddAddressPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
