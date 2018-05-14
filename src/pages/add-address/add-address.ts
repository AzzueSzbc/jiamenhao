import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { HermesProvider } from '../../providers/hermes/hermes';

@IonicPage()
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage {

  usingURL: string = "addNewShippingAddress_buyer.php";

  myID: string;
  myToken: string;
  respData: any;

  addressForm: FormGroup;
  gender: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public hermes: HermesProvider,
    private alertCtrl: AlertController,
    private storage: Storage, ) {

    this.addressForm = this.formBuilder.group({
      consigneeAddress: ['', Validators.required],
      consigneeName: ['', Validators.required],
      consigneeGender: ['先生'],
      consigneePhoneNumber: ['', Validators.required],
    })
  }

  ionViewWillEnter() {
    this.storage.get('clientid').then((val) => { this.myID = val });
    this.storage.get('clienttoken').then((val) => { this.myToken = val });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressPage');
  }

  addressSubmit(value: any): void {
    if (this.addressForm.valid && this.myID && this.myToken) {

      this.hermes.hermes(this.usingURL, {
        buyerID: this.myID,
        buyerToken: this.myToken,
        consigneeAddress: value.consigneeAddress,
        consigneeName: value.consigneeName,
        consigneeGender: value.consigneeGender,
        consigneePhoneNumber: value.consigneePhoneNumber,
      })
        .subscribe((data) => {
          this.respData = data;
          if (this.respData.querySuccess) {
            //成功提交
            this.navCtrl.pop();
          }
          else {//程序错误
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '提交错误，可能由于用户登录信息过期，或表单填写错误',
              buttons: ['确定']
            });
            alert.present();
          }
        }, (err) => {
          console.log("Oooops!");
        }
        );

    }
    console.log(this.addressForm.value);
  }

}
