import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPackInfoPage } from './test-pack-info';

@NgModule({
  declarations: [
    TestPackInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(TestPackInfoPage),
  ],
})
export class TestPackInfoPageModule {}
