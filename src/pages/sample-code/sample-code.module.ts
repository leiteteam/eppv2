import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleCodePage } from './sample-code';

@NgModule({
  declarations: [
    SampleCodePage,
  ],
  imports: [
    IonicPageModule.forChild(SampleCodePage),
  ],
})
export class SampleCodePageModule {}
