import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { NativeProvider } from '../../../providers/native/native';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage {

  myID: string;
  myToken: string;

  addressForm: FormGroup;
  gender: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private userPvd: UserProvider,
    private nativePvd: NativeProvider) {

    this.addressForm = this.formBuilder.group({
      consigneeAddress: ['', Validators.required],
      consigneeName: ['', Validators.required],
      consigneeGender: ['先生'],
      consigneePhoneNumber: ['', Validators.required],
    })
  }

  ionViewWillEnter() {
    this.nativePvd.getStorage('clientid').then((id) => { this.myID = id });
    this.nativePvd.getStorage('clienttoken').then((token) => { this.myToken = token });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressPage');
  }

  addressSubmit(value: any): void {
    if (this.addressForm.valid && this.myID && this.myToken) {
      this.userPvd.addNewShippingAddress({
        buyerID: this.myID,
        buyerToken: this.myToken,
        consigneeAddress: value.consigneeAddress,
        consigneeName: value.consigneeName,
        consigneeGender: value.consigneeGender,
        consigneePhoneNumber: value.consigneePhoneNumber,
      })
        .subscribe(
          (res) => {
            if (res == true) {
              this.navCtrl.pop();
            }
          },
          (err) => {
            console.log('add-address-err', err);
          }
        );
    }
    console.log(this.addressForm.value);
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
