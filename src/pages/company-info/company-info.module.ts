import { MultiPickerModule } from 'ion-multi-picker';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyInfoPage } from './company-info';

@NgModule({
  declarations: [
    CompanyInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyInfoPage),
    MultiPickerModule,
  ],
})
export class CompanyInfoPageModule {}
