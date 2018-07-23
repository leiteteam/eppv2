import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupSettingPage } from './group-setting';
import { MultiPickerModule } from '../../../node_modules/ion-multi-picker';

@NgModule({
  declarations: [
    GroupSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupSettingPage),
    MultiPickerModule,
  ],
})
export class GroupSettingPageModule {}
