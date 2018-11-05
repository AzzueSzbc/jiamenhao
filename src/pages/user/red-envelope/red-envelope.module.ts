import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RedEnvelopePage } from './red-envelope';

@NgModule({
  declarations: [
    RedEnvelopePage,
  ],
  imports: [
    IonicPageModule.forChild(RedEnvelopePage),
  ],
})
export class RedEnvelopePageModule {}
