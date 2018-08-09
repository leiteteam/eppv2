import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestAcceptPage } from './test-accept';

@NgModule({
  declarations: [
    TestAcceptPage,
  ],
  imports: [
    IonicPageModule.forChild(TestAcceptPage),
  ],
})
export class TestAcceptPageModule {}
