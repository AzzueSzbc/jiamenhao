import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyFootprintPage } from './my-footprint';

@NgModule({
  declarations: [
    MyFootprintPage,
  ],
  imports: [
    IonicPageModule.forChild(MyFootprintPage),
  ],
})
export class MyFootprintPageModule {}
