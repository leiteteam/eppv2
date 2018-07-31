import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpleStationInfoPage } from './sple-station-info';

@NgModule({
  declarations: [
    SpleStationInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SpleStationInfoPage),
  ],
})
export class SpleStationInfoPageModule {}
