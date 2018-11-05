import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { NativeProvider } from '../../../providers/native/native';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-shipping-address',
  templateUrl: 'shipping-address.html',
})
export class ShippingAddressPage {

  address: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private nativePvd: NativeProvider,
    private userPvd: UserProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShippingAddressPage');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  //页面加载
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
                this.address = res;
              }
            },
            (err) => {
              console.log('get-all-address', err);
            }
          )
      });
    });
  }

  ModifyShippingAddress(addressID) {
    /*let modifyShippingAddressPage = this.modalCtrl.create('ModifyShippingAddressPage', {
      addressID: addressID
    });
    modifyShippingAddressPage.onDidDismiss((data) => {
      if (data) {
        this.refreshDisplay();
      }
    });
    modifyShippingAddressPage.present();*/
  }

  pushAddAddress() {
    this.navCtrl.push('AddAddressPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
