import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskSummaryDialogPage } from './task-summary-dialog';

@NgModule({
  declarations: [
    TaskSummaryDialogPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskSummaryDialogPage),
  ],
})
export class TaskSummaryDialogPageModule {}
