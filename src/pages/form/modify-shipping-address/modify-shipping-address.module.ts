import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyShippingAddressPage } from './modify-shipping-address';

@NgModule({
  declarations: [
    ModifyShippingAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyShippingAddressPage),
  ],
})
export class ModifyShippingAddressPageModule {}
