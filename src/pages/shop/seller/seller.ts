import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { ShopProvider } from '../../../providers/shop/shop';
import { NativeProvider } from '../../../providers/native/native';

@IonicPage()
@Component({
  selector: 'page-seller',
  templateUrl: 'seller.html',
})
export class SellerPage {

  sellerData: any;

  isConnect: boolean;
  isLoading: boolean;
  isQuery: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativePvd: NativeProvider,
    private shopPvd: ShopProvider) {
  }

  ionViewWillEnter() {
    this.sellerData = this.navParams.get('sellerdata');
    //确认用户是否联网
    this.nativePvd.detectNetwork(() => {
      //已联网
      this.isConnect = true;
      //加载页面
      this.isLoading = true;
      this.refreshDisplay().subscribe((res) => {
        console.log("DeliverPage ionViewWillEnter refreshDisplay res:", res);
      }, (err) => {
        console.log("DeliverPage ionViewWillEnter refreshDisplay err:", err);
      });
    }, () => {
      //没有网络
      this.isConnect = false;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerPage');
  }

  //更新显示
  refreshDisplay() {
      //已联网，获得商家店铺数据
      return this.shopPvd.getOneShopData(this.navParams.get('sellerid'))
        .pipe(
          tap(
            (res) => {
              console.log("ShopPage-refreshDisplay-getOneShopData-res:", res);
              if (res == "请求失败") {  //请求失败进行提醒
                this.isQuery = false;
                this.detectNetworkError();
              } else if (res) {
                this.isQuery = true;
                this.sellerData = res;
              }
              //停止加载动画显示
              this.isLoading = false;
            },
            (err) => {  //http发生错误
              console.log('home-getallshop-err', err);
              this.isQuery = false;
              this.detectNetworkError();
              //停止加载动画显示
              this.isLoading = false;
            }
          )
          );
  }

  //网络错误处理
  detectNetworkError() {
    this.nativePvd.detectNetwork(() =>{
      this.nativePvd.presentSimpleToast("加载失败，请稍后重试");
    }, () => {
      this.isConnect = false;
    });
  }

}
