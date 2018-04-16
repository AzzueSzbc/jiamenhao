import { Component } from '@angular/core';
import { App, AlertController, NavParams, NavController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';

import { LoginPage }    from '../login/login';
import { SettingsPage } from '../settings/settings';
import { UserdataPage } from '../userdata/userdata';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public hostsURL: string = 'http://144.202.120.126:888/';

  usingURL: string = 'getBuyerBasicInformation.php';
  myID:     string;
  respData:any;

  userData:any;

  islogined: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              private alertCtrl: AlertController,
              private storage: Storage,
              private app: App) {

    this.navCtrl = navCtrl;
    this.http    = http;
  }

  ionViewWillEnter(){
    this.storage.get('clientid').then((val)=>{this.myID = val});
    this.storage.get('clientToken').then((tokenVal) => {
      if (tokenVal) {
        var link = this.hostsURL + this.usingURL;
        var myData = JSON.stringify({ buyerID: this.myID, buyerToken: tokenVal });
        console.log("buyerID:",this.myID,"buyerToken:",tokenVal);
        this.http.post(link, myData)
          .subscribe((res: Response) => {
            this.respData = res.json();
            console.log(this.respData);
            this.islogined = this.respData.querySuccess;
            if(this.respData.querySuccess) {
              this.userData = this.respData.queryResult[0];
              console.log(this.userData);
            }
            else {
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '用户身份验证过期，请重新登录',
                buttons: ['确定']
              });
              alert.present();
              this.islogined = false;
            }
          }, error => {
            console.log("-------Oooops!");
          });
      } else {
        this.islogined = false;
      }
    });
  }

  ionViewDidEnter(){
    console.log('ContactPage ionViewDidEnter');
  }

  openSettingsPage(){
    this.app.getRootNav().push(SettingsPage);
  }

  openUserdataPage(){
    this.app.getRootNav().push(UserdataPage);
  }

  openLoginPage(){
    this.app.getRootNav().push(LoginPage);
  }
}
