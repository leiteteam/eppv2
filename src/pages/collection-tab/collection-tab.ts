import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, Events } from 'ionic-angular';
import { BasePage } from '../base/base';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

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
  constructor(
    public device:DeviceIntefaceServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events:Events) {
    super(navCtrl,navParams);
    events.subscribe('logoutNotification',()=>{
      AppServiceProvider.getInstance().userinfo.appType = "";
      this.device.push("updateUserInfo",JSON.stringify(AppServiceProvider.getInstance().userinfo),()=>{
        this.navCtrl.setRoot("HomePage");
      });
    });
  }

  ionViewDidEnter(){

  }

  onTabChanged(){
    let previous = this.tabs.previousTab(false);
    if (this.tabs.getSelected().root == "CollectionPage"){
      if (previous.root == "DataManagerPage"){
        this.events.publish('tabChanged');
      }
    }
  }
}
