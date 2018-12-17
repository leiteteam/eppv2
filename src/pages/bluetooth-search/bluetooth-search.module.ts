import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BluetoothSearchPage } from './bluetooth-search';

@NgModule({
  declarations: [
    BluetoothSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothSearchPage),
  ],
})
export class BluetoothSearchPageModule {}
