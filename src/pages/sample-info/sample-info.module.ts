import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleInfoPage } from './sample-info';

@NgModule({
  declarations: [
    SampleInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SampleInfoPage),
    PipesModule,
  ],
})
export class SampleInfoPageModule {}
