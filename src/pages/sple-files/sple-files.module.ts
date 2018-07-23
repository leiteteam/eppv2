import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpleFilesPage } from './sple-files';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SpleFilesPage,
  ],
  imports: [
    IonicPageModule.forChild(SpleFilesPage),
    ComponentsModule
  ],
})
export class SpleFilesPageModule {}
