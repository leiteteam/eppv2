import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionTabPage } from './collection-tab';

@NgModule({
  declarations: [
    CollectionTabPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectionTabPage),
  ]
})
export class CollectionTabPageModule {}
