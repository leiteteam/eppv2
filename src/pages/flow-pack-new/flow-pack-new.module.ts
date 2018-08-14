import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlowPackNewPage } from './flow-pack-new';
import { MultiPickerModule } from '../../../node_modules/ion-multi-picker';

@NgModule({
  declarations: [
    FlowPackNewPage,
  ],
  imports: [
    IonicPageModule.forChild(FlowPackNewPage),
    MultiPickerModule,
  ],
})
export class FlowPackNewPageModule {}
