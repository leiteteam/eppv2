import { DeviceIntefaceServiceProvider } from './../../providers/device-inteface-service/device-inteface-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the FlowPackManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flow-pack-manager',
  templateUrl: 'flow-pack-manager.html',
})
export class FlowPackManagerPage extends BasePage{

  spleNo:string = "";
  packList:any = [];

  packCates: any = { '1': '普通检测样包', '2': '实验室间质控样包', '3': '入库包'};

  spleCates: any = { '1': '表层土壤','2': '深层土壤' ,'3': '农产品' };

  testItems: any = { '1': '仅多环芳烃','2': '含多环芳烃','3': '无多环芳烃','4': '氰化物', '5': '无机包'};

  status: any = { '1': '可用','2': '已封包', '3': '已流转','4': '已接收'};

  constructor(
    public net:TyNetworkServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController,
    public device:DeviceIntefaceServiceProvider) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlowPackManagerPage');
    
    this.flowPackList();
  }

  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    this.flowPackList(refresher);
  }

  flowPackList(refresher?){
    this.net.httpPost(AppGlobal.API.flowPackList,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token
    },(msg)=>{
      let info = JSON.parse(msg);
      this.packList = [];
      this.packList = info.packageList;

      if (refresher) {
        refresher.complete();
      }
    },err=>{
      this.toast(err);
      if (refresher) {
        refresher.complete();
      }
    },true);
  }

  gotoPackInfo(pack){
    this.navCtrl.push("FlowPackInfoPage",{packNo:pack.PackageCode,callback:this.callback});
  }

  print(pack){
    this.device.push("printInit","hello print!",msg =>{
      console.log("连接成功，正在打印...");
      this.device.push("print", "包码:" + pack.PackageCode ,msg =>{
        console.log("打印成功");
      },err => {
        this.toast(err);
        console.log("push failed");
        console.log(err);
      });
    },err => {
      this.toast(err);
      console.log("push failed");
      console.log(err);
    });
  }

  newPack(){
    this.navCtrl.push("FlowPackNewPage",{callback:this.callback});
  }

  //选择条件回调
  callback = (packList) => {
    if (packList){
      console.log("callback success-->new pack");
      this.packList = [];
      this.packList = packList;
    }else {
      this.flowPackList();
    }
  }

}
