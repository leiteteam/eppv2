import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestProgressPage } from './test-progress';

@NgModule({
  declarations: [
    TestProgressPage,
  ],
  imports: [
    IonicPageModule.forChild(TestProgressPage),
  ],
})
export class TestProgressPageModule {}
