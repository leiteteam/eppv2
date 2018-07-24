import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage extends BasePage{

  constructor(public device:DeviceIntefaceServiceProvider,public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

  
  gotoSpleFiles(){
    this.navCtrl.push("SpleFilesPage");
  }

  gotoGroupSetting(){
    this.navCtrl.push("GroupSettingPage");
  }

  gotoOfflineMap(){
    this.device.push("offlineMap");
  }

  gotoSettings(){
    this.navCtrl.push("SettingPage");
  }

  gotoDelivery(){
    this.navCtrl.push("SpleInfoPage");
    // this.device.push("qrCodeScan",'',(spleNo)=>{
    //   console.log("spleNo:"+spleNo);
    //   this.navCtrl.push("SpleInfoPage");
    // },(err)=>{
    //   this.toastShort(err);
    // });
  }
}
