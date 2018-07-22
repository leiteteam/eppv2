import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskMapPage } from './task-map';

@NgModule({
  declarations: [
    TaskMapPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskMapPage),
  ],
})
export class TaskMapPageModule {}
