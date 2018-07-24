import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the CollectionTabPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collection-tab',
  templateUrl: 'collection-tab.html'
})
export class CollectionTabPage {

  mapRoot = 'TaskMapPage'
  collectRoot = 'CollectionPage'
  syncRoot = 'BuildingPage'
  moreRoot = 'MorePage'


  constructor(public navCtrl: NavController) {}

}
