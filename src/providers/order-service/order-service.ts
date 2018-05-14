import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HermesProvider } from '../hermes/hermes';
import 'rxjs/add/operator/map';

@Injectable()
export class OrderServiceProvider {

  constructor(public http: HttpClient,
    public hermes: HermesProvider,
    private alertCtrl: AlertController,) {
    console.log('Hello OrderServiceProvider Provider');
  }

  public getOneShippingAddress(data) {
    return this.hermes.hermes("getShippingAddressByID_buyer.php", data);
  }

  public submitOrderData(data) {
    return this.hermes.hermes("addNewOrder.php", data);
  }
}
