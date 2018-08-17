import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal } from '../../providers/app-service/app-service';

/**
 * Generated class for the TestAccPackInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-acc-pack-info',
  templateUrl: 'test-acc-pack-info.html',
})
export class TestAccPackInfoPage extends BasePage{

  packNo:string = "";
  pack:any = {};
  subSpleList:any[] = [];

  packCates: any = { '1': '普通检测样包', '2': '实验室间质控样包', '3': '入库包'};
  spleCates: any = { '1': '表层土壤','2': '深层土壤' ,'3': '农产品' };
  testItems: any = { '1': '仅多环芳烃','2': '含多环芳烃','3': '无多环芳烃','4': '氰化物', '5': '无机包'};
  status: any = { '1': '可用','2': '已封包', '3': '已流转','4': '已接收'};

  constructor(
    public device :DeviceIntefaceServiceProvider,
    public net:TyNetworkServiceProvider,
    public alert:AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestAccPackInfoPage');
    this.packNo = this.navParams.data.packNo;
    this.testPackInfo();
  }

  testPackInfo(){
    this.net.httpPost(AppGlobal.API.testPackAccInfo,{
      "PackageCode": this.packNo
    },(msg)=>{
      this.pack = JSON.parse(msg);
      this.subSpleList = this.pack.details;
    },err=>{
      this.toast(err);
    },true);
  }

}
