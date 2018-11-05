import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRatingPage } from './add-rating';

@NgModule({
  declarations: [
    AddRatingPage,
  ],
  imports: [
    IonicPageModule.forChild(AddRatingPage),
  ],
})
export class AddRatingPageModule {}
