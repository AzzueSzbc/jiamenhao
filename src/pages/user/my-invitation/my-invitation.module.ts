import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyInvitationPage } from './my-invitation';

@NgModule({
  declarations: [
    MyInvitationPage,
  ],
  imports: [
    IonicPageModule.forChild(MyInvitationPage),
  ],
})
export class MyInvitationPageModule {}
