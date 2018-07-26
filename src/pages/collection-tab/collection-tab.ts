import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { BasePage } from '../base/base';

/**
 * Generated class for the CollectionTabPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  templateUrl: 'collection-tab.html'
})
export class CollectionTabPage extends BasePage{

  mapRoot = 'TaskMapPage'
  collectRoot = 'CollectionPage'
  syncRoot = 'DataManagerPage'
  moreRoot = 'MorePage'

  @ViewChild('tabs')  tabs:Tabs;
  constructor(public navCtrl: NavController,public navParams: NavParams,) {
    super(navCtrl,navParams);
  }

  ionViewDidEnter(){

  }

  onTabChanged(){
    let previous = this.tabs.previousTab(false);
    if (previous){
      console.log("previous tab is -->"+previous.root);
    }else {
      
    }
  }
}
