import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  hostsURL: string = 'http://120.78.220.83:22781/';
  usingURL: string = 'buyerRegister.php';
  myID: string;
  respData: any;

  registerForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public http: HttpClient) {

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerSubmit(value: any): void {
    if (this.registerForm.valid) {
      var myData = JSON.stringify({
        buyerUserName: value.username, buyerPasswordSHA: value.password,
        buyerAccount: value.phoneNumber, buyerEmail: value.email
      });
      var link = this.hostsURL + this.usingURL;

      this.http.post(link, myData)
        .subscribe((res) => {
          this.respData = res;
          if (this.respData.querySuccess) {
            this.navCtrl.pop();
          } else {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '账户注册失败，请检查并重新填写',
              buttons: ['确定']
            });
            alert.present();
          }

        }, (err) => {
          console.log("Oooops!");
        });

    }
    console.log(this.registerForm.value);
  }

}
