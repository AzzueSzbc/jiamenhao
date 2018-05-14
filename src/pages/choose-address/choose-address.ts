import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { AddAddressPage } from '../add-address/add-address';

@IonicPage()
@Component({
  selector: 'page-choose-address',
  templateUrl: 'choose-address.html',
})
export class ChooseAddressPage {

  public hostsURL: string = 'http://144.202.120.126:888/';
  usingURL: string = 'getBuyerShippingAddress.php';
  myID: string;
  myToken: string;
  respData: any;

  addressData: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    private alertCtrl: AlertController,
    private storage: Storage, ) {
  }

  ionViewWillEnter() {
    this.storage.get('clientid').then((val) => { this.myID = val });
    this.storage.get('clienttoken').then((val) => {
      if (val) {
        this.myToken = val;
        this.getUserShippingAddress();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseAddressPage');
  }

  getUserShippingAddress() {
    var link = this.hostsURL + this.usingURL;
    var myData = JSON.stringify({ buyerID: this.myID, buyerToken: this.myToken });
    console.log("buyerID:", this.myID, "buyerToken:", this.myToken);
    this.http.post(link, myData)
      .subscribe((res) => {
        console.log(res);
        this.respData = res;
        if (this.respData.querySuccess) {
          this.addressData = this.respData.queryResult;
          console.log(this.addressData);
        }
        else {
          let alert = this.alertCtrl.create({
            title: '提示信息',
            subTitle: '用户身份验证过期，请重新登录',
            buttons: ['确定']
          });
          alert.present();
        }
      }, (err) => {
        console.log("获得用户数据错误！");
      });
  }

  selectAddress(id) {
    this.storage.set("addressid", id);
    this.navCtrl.pop();
  }

  pushAddAddress() {
    this.navCtrl.push(AddAddressPage);
  }

}
