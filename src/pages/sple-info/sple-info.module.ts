import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpleInfoPage } from './sple-info';

@NgModule({
  declarations: [
    SpleInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SpleInfoPage),
  ],
})
export class SpleInfoPageModule {}
