import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the TestPackInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-pack-info',
  templateUrl: 'test-pack-info.html',
})
export class TestPackInfoPage extends BasePage{

  SampleCategorys = {
    "1":"表层土壤",
    "2":"深层土壤",
    "3":"水稻",
    "4":"小麦",
    "5":"蔬菜及其他农产品",
    "6":"其他"
  };
  
  labSampleCode:string = "";
  packNo = "";
  pack:any = {};
  
  constructor(
    public net:TyNetworkServiceProvider,
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
    console.log('ionViewDidLoad TestPackInfoPage');
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
        this.navCtrl.pop();
      },
      true);
  }

  test(){
    if (!this.labSampleCode){
      this.toast("请输入关联内部码");
      return;
    }
    this.net.httpPost(
      AppGlobal.API.testFinish,
      {
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        'TwoSampleId':this.pack.TwoSampleId,
        "LabSampleCode":this.labSampleCode
      },
      msg => {
        console.log(msg);
        this.toastShort("测试成功");
        this.navCtrl.pop();
        if (this.navParams.data.callback){
          this.navParams.data.callback(this.pack);
        }
      },
      error => {
        this.toast(error);
        //this.navCtrl.pop();
      },
      true);
  }
}
