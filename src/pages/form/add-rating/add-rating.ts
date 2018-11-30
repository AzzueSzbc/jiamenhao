import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { NativeProvider } from '../../../providers/native/native';
import { StorageProvider } from '../../../providers/storage/storage';
import { OrderProvider } from '../../../providers/order/order';

interface ratingCommodity {
  name: string

}

@IonicPage()
@Component({
  selector: 'page-add-rating',
  templateUrl: 'add-rating.html',
})
export class AddRatingPage {

  star: number = 3;
  ratingRiderAttitude: number;
  haveRiderAttitude: boolean = false;
  ratingForm: FormGroup;

  rider: any;
  shopRatingForm: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private nativePvd: NativeProvider,
    private storagePvd: StorageProvider,
    private orderPvd: OrderProvider) {
    storagePvd.getStorageAccount().then((buyer) => {
      if (buyer) {
        orderPvd.getOneOrder({
          userID: buyer.userID,
          token: buyer.token,
          purchaseOrderID: navParams.get('orderID')
        })
          .subscribe((res) => {
            console.log("AddRatingPage-constructor-getOneOrder-res:", res);
            this.rider = res.rider;
            this.shopRatingForm = res;
            console.log("AddRatingPage-constructor-getOneOrder-rider:", this.rider);
            console.log("AddRatingPage-constructor-getOneOrder-shopRatingForm:", this.shopRatingForm);
          })
      }
    });

    this.ratingForm = this.formBuilder.group({
      comment: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRatingPage');
  }

  changeStar(star) {
    this.star = star;
  }

  changeAttitude(attitude: number) {
    this.ratingRiderAttitude = attitude;
    this.haveRiderAttitude = true;
  }

  submitRating() {
    if (this.haveRiderAttitude && (this.ratingForm.value.comment.length > 0)) {
      this.storagePvd.getStorageAccount().then((buyer) => {
        if (buyer) {
          this.orderPvd.commentsRider({
            userID: buyer.userID,
            token: buyer.token,
            riderID: this.rider.riderID,
            riderCommentRate: this.ratingRiderAttitude,
            riderCommentContent: ''
          }).subscribe((res) => {
            if (res == true) {
              this.orderPvd.commentsOrder({
                userID: buyer.userID,
                token: buyer.token,
                purchaseOrderID: this.shopRatingForm.purchaseOrderID,
                commentRate: this.star,
                commentContent: this.ratingForm.value.comment
              }).subscribe((res) => {
                if (res == true) {
                  this.navCtrl.pop();
                }
              }, (err) => {
                console.log("addRatingPage submitRating commentsOrder err:", err);
              });
            }
          }, (err) => {
            console.log("addRatingPage submitRating commentsRider err:", err);
          });
        }
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
