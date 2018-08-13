import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the FlowingPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flowing',
  templateUrl: 'flowing.html'
})
export class FlowingPage extends BasePage{

  flowProgressRoot = 'FlowProgressPage'
  flowAcceptRoot = 'FlowSpleAcceptPage'
  flowPackManagerRoot = 'FlowPackManagerPage'
  flowFlowingRoot = 'FlowPackFlowPage'
  flowMoreRoot = 'FlowMorePage'

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

}
