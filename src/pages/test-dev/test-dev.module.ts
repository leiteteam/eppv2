import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestDevPage } from './test-dev';

@NgModule({
  declarations: [
    TestDevPage,
  ],
  imports: [
    IonicPageModule.forChild(TestDevPage),
  ],
})
export class TestDevPageModule {}
