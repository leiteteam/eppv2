import { MultiPickerModule } from 'ion-multi-picker';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectProcessPage } from './collect-process';

@NgModule({
  declarations: [
    CollectProcessPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectProcessPage),
    MultiPickerModule,
  ],
})
export class CollectProcessPageModule {}
