import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlowPackManagerPage } from './flow-pack-manager';

@NgModule({
  declarations: [
    FlowPackManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(FlowPackManagerPage),
  ],
})
export class FlowPackManagerPageModule {}
