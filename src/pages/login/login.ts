import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public hostsURL: string = 'http://144.202.120.126:888/';
  usingURL: string = 'buyerNoTokenLogin.php';
  respData: any;

  loginForm: FormGroup;

  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginSubmit(value: any): void {
    if (this.loginForm.valid) {
      var myData = JSON.stringify({ buyerAccount: value.username, buyerPasswordSHA: value.password });
      var link = this.hostsURL + this.usingURL;

      this.http.post(link, myData)
        .subscribe((res) => {
          this.respData = res;
          if (this.respData.querySuccess) {
            this.storage.set('clientid', this.respData.buyerID);
            this.storage.set('clienttoken', this.respData.buyerToken);
            let toast = this.toastCtrl.create({
              message: '登录成功',
              duration: 1000,
              position: 'middle'
            });
            toast.present();
            this.navCtrl.setRoot(TabsPage);
            this.navCtrl.popToRoot();
          } else {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '账户或密码错误，请重新输入',
              buttons: ['确定']
            });
            alert.present();
          }

        }, (err) => {
          console.log("Oooops!");
        });

      let loading = this.loadingCtrl.create({
        content: '急毛啊没做完啊登陆页面都做了好久啊！',
        dismissOnPageChange: true
      });

      loading.present();

    }
    console.log(this.loginForm.value);
  }

}
