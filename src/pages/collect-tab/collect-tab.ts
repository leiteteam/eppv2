import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CollectTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collect-tab',
  templateUrl: 'collect-tab.html',
})
export class CollectTabPage {

  mapRoot = 'TaskMapPage'
  collectRoot = 'CollectionPage'
  syncRoot = 'BuildingPage'
  moreRoot = 'MorePage'

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectTabPage');
  }

}
