import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddOrderNotePage } from './add-order-note';

@NgModule({
  declarations: [
    AddOrderNotePage,
  ],
  imports: [
    IonicPageModule.forChild(AddOrderNotePage),
  ],
})
export class AddOrderNotePageModule {}
