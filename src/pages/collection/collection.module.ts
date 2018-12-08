import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionPage } from './collection';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CollectionPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectionPage),
    ComponentsModule
  ],
})
export class CollectionPageModule {}
