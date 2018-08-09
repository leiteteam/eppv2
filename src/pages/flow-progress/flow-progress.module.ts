import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlowProgressPage } from './flow-progress';

@NgModule({
  declarations: [
    FlowProgressPage,
  ],
  imports: [
    IonicPageModule.forChild(FlowProgressPage),
  ],
})
export class FlowProgressPageModule {}
