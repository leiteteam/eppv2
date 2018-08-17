import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage extends BasePage{

  versionName:string = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private device: DeviceIntefaceServiceProvider,
    ) {
      super(navCtrl,navParams);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
    this.device.push("version","",ver=>{
      this.versionName = ver;
    })
  }

}
