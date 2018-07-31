import { MultiPickerModule } from 'ion-multi-picker';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectTaskPage } from './collect-task';

@NgModule({
  declarations: [
    CollectTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectTaskPage),
    MultiPickerModule
  ],
})
export class CollectTaskPageModule {}
