import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestMorePage } from './test-more';

@NgModule({
  declarations: [
    TestMorePage,
  ],
  imports: [
    IonicPageModule.forChild(TestMorePage),
  ],
})
export class TestMorePageModule {}
