import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the TestingPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html'
})
export class TestingPage extends BasePage{

  testProgressRoot = 'TestProgressPage'
  testAcceptRoot = 'TestAcceptPage'
  testTestingRoot = 'TestTestingPage'
  testMoreRoot = 'TestMorePage'

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
