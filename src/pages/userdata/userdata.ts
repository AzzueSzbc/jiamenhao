import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../tabs/tabs';
import { EntrancePage } from '../entrance/entrance';

@IonicPage()
@Component({
  selector: 'page-userdata',
  templateUrl: 'userdata.html',
})
export class UserdataPage {

  public hostsURL: string = 'http://144.202.120.126:888/';

  usingURL: string = 'getBuyerBasicInformation.php';
  myID:     string;
  respData:any;

  userData:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private storage: Storage,
              public http: Http,) {

                this.navCtrl = navCtrl;
                this.http    = http;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserdataPage');
  }

  ionViewWillEnter() {

    this.storage.get('clientid').then((val)=>{this.myID = val});
    this.storage.get('clientToken').then((results) => {
      if (results) {

        var link = this.hostsURL + this.usingURL;
        var myData = JSON.stringify({ buyerID: this.myID, buyerToken: results });
        console.log("buyerID:",this.myID,"buyerToken:",results);

        this.http.post(link, myData)
          .subscribe((res: Response) => {
            this.respData = res.json();
            console.log(this.respData.querySuccess);

            if (this.respData.querySuccess)
              this.userData = this.respData.queryResult[0];
            else {
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '用户身份验证过期，请重新登录',
                buttons: ['确定']
              });
              alert.present();
            }

          }, error => {
            console.log("-------Oooops!");
          });

      } else {
        this.navCtrl.push(EntrancePage);
      }
    });

  }


  userLogout() {

    this.storage.remove('clientid');
    this.storage.remove('clientToken');

    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();
  }


}
