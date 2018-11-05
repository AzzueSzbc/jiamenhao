import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeProvider } from '../../../providers/native/native';
import { ShopProvider } from '../../../providers/shop/shop';

import { PICTURE_WAREHOUSE_URL } from '../../../providers/config';

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {

  pictureWarehouseURL: string = PICTURE_WAREHOUSE_URL;

  stars: number = 4;

  validRate: any[] = [];
  haveRate: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

  ionViewWillEnter() {
    this.refreshDisplay();
  }

  refreshDisplay() {
    //获得商家所有评论
    this.validRate = [];
    let rates: any[] = [];
    //console.log("sellerID:", this.navParams.get('sellerid'));
    this.shopPvd.getAllSellerComment(this.navParams.get('sellerid'))
      .subscribe(
        (res) => {
          console.log('RatingPage AllSellerComment res:', res);
          if (res != null && res != false) {  //获得的返回数据不为空
            rates = res;
            //保存有评论的数据
            rates.forEach((rate) => {
              if (rate.ordersComment != null) {
                this.validRate.push(rate);
                this.haveRate = true;
              }
            });
            //添加date键，保存时间字符串转换后的Date对象
            this.validRate.forEach((rate) => {
              rate['date'] = this.parseTimeString(rate.ordersComment.ordersCommentTime);
            });
            //将评论数据按照时间排序
            this.validRate.sort(this.compare('date'));
            console.log("RatingPage AllSellerComment validRate:", this.validRate);

          } else if (res == false) {

          } else if (res == null) { //获得的返回数据为空

            this.haveRate = false;
            console.log('RatingPage AllSellerComment res null');

          }
        },
        (err) => {
          console.log('rating-getAllSellerComment', err);
        }
      );
  }
  //排序方法
  compare(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  }
  //将时间字符串解析为Date对象
  //时间字符串格式: "YYYY-MM-DD hh:mm:ss"
  parseTimeString(timeString: string) {
    let time = new Date();
    time.setFullYear(parseInt(timeString.substr(0, 4)), parseInt(timeString.substr(5, 2)), parseInt(timeString.substr(8, 2))); time.setHours(parseInt(timeString.substr(11, 2)), parseInt(timeString.substr(14, 2)), parseInt(timeString.substr(17, 2)));
    return time;
  }

}
