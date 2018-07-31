import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataManagerPage } from './data-manager';

@NgModule({
  declarations: [
    DataManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(DataManagerPage),
  ],
})
export class DataManagerPageModule {}
