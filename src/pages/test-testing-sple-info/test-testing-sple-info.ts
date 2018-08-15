import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal } from '../../providers/app-service/app-service';

/**
 * Generated class for the TestTestingSpleInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-testing-sple-info',
  templateUrl: 'test-testing-sple-info.html',
})
export class TestTestingSpleInfoPage extends BasePage{
  packNo = "";
  pack:any = {};
  
  constructor(public net:TyNetworkServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public device:DeviceIntefaceServiceProvider,
    public toastCtrl:ToastController,) {
      super(navCtrl,navParams,toastCtrl);
      if (navParams.data.packNo){
        this.packNo = navParams.data.packNo;
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestTestingSpleInfoPage');
    this.queryPackInfo();
  }

  queryPackInfo(){
    this.net.httpPost(
      AppGlobal.API.testPackInfo,
      {
        'SubSampleId':this.packNo
      },
      msg => {
        console.log(msg);
        this.pack = JSON.parse(msg);
      },
      error => {
        this.toast(error);
      },
      true);
  }
}
