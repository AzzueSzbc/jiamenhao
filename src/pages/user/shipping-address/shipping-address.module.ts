import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShippingAddressPage } from './shipping-address';

@NgModule({
  declarations: [
    ShippingAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ShippingAddressPage),
  ],
})
export class ShippingAddressPageModule {}
