import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectTabPage } from './collect-tab';

@NgModule({
  declarations: [
    CollectTabPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectTabPage),
  ],
})
export class CollectTabPageModule {}
