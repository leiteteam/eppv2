import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Tabs } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the PreparationPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preparation',
  templateUrl: 'preparation.html'
})
export class PreparationPage  extends BasePage{

  prepProgressRoot = 'PrepProgressPage'
  prepSpleAcceptRoot = 'PrepSpleAcceptPage'
  prepPrpareRoot = 'PrepPrparePage'
  prepFlowRoot = 'PrepFlowPage'
  prepMoreRoot = 'PrepMorePage'

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
      },()=>{
        this.navCtrl.setRoot("HomePage");
      });
    });
  }

  ionViewDidEnter(){

  }

  onTabChanged(){

  }
}
