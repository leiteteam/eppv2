import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlowPackInfoPage } from './flow-pack-info';

@NgModule({
  declarations: [
    FlowPackInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(FlowPackInfoPage),
  ],
})
export class FlowPackInfoPageModule {}
