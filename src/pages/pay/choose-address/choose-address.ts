import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../../providers/native/native';
import { StorageProvider } from '../../../providers/storage/storage';
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
    private storagePvd: StorageProvider,
    private userPvd: UserProvider) {
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseAddressPage');
  }

  refreshDisplay() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.userPvd.getAllShippingAddress(buyer.userID, buyer.token)
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
      }
    });
  }

  selectAddress(id) {
    this.storagePvd.setStorageAccountDefaultAddressID(parseInt(id)).then((val) => {
      console.log(val);
    });
    this.navCtrl.pop();
  }

  pushAddAddress() {
    this.navCtrl.push('AddAddressPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
