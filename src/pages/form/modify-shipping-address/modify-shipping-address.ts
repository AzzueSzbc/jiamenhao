import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { NativeProvider } from '../../../providers/native/native';
import { StorageProvider } from '../../../providers/storage/storage';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-modify-shipping-address',
  templateUrl: 'modify-shipping-address.html',
})
export class ModifyShippingAddressPage {

  addressForm: FormGroup;
  gender: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    private userPvd: UserProvider,
    private storagePvd: StorageProvider,
    private nativePvd: NativeProvider) {
      this.addressForm = this.formBuilder.group({
        consigneeAddress: ['', Validators.required],
        consigneeName: ['', Validators.required],
        consigneeGender: ['先生'],
        consigneePhoneNumber: ['', Validators.required],
      })
  }

  ionViewWillEnter() {

  }

  addressSubmit() {
    this.storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        this.userPvd.modifyShippingAddress(
          buyer.userID,
          buyer.token,
          this.navParams.get('addressID'),
          this.addressForm.value.consigneeAddress,
          this.addressForm.value.consigneeName,
          this.addressForm.value.consigneeGender,
          this.addressForm.value.consigneePhoneNumber
        ).subscribe((res) => {
          if (res) {
            this.complete(true);
          }
        }, (err) => {
          this.nativePvd.presentSimpleAlert("出错啦QAQ");
        });
      }
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 complete(data) {
   this.viewCtrl.dismiss(data);
 }

}
