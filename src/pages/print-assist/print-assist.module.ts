import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintAssistPage } from './print-assist';

@NgModule({
  declarations: [
    PrintAssistPage,
  ],
  imports: [
    IonicPageModule.forChild(PrintAssistPage),
  ],
})
export class PrintAssistPageModule {}
