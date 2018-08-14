import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the FlowProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flow-progress',
  templateUrl: 'flow-progress.html',
})
export class FlowProgressPage extends BasePage{

  progCategory: any = "accept";
  spleType = "main";
  tabList = [{name:"accept",count:4},{name:"accepted",count:0},{name:"flowed",count:0}];
  acceptList:any[] = [];
  acceptedList:any[] = [];
  flowedList:any[] = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController,
    public modalCtrl: ModalController,
    private net: TyNetworkServiceProvider,
    public device:DeviceIntefaceServiceProvider) {
    super(navCtrl,navParams,toastCtrl);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlowProgressPage');
    this.getAcceptList();
  }

  segmentClick(index:number) {
    //alert(this.dictCode[item]);
    this.progCategory = this.tabList[index].name;
    if (index == 0){
      this.getAcceptList();
    }

    if (index == 1){
      this.getAcceptedList();
    }

    if (index == 2){
      this.getFlowedList();
    }
  }

  getAcceptList(){
    this.net.httpPost(AppGlobal.API.flowProgress,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":8
    },msg=>{
      let info = JSON.parse(msg);
      this.acceptList = info.subList;
    },err=>{
      this.toast(err);
    },true);
  }

  getAcceptedList(){
    this.net.httpPost(AppGlobal.API.flowProgress,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":9
    },msg=>{
      let info = JSON.parse(msg);
      this.acceptedList = info.subList;
    },err=>{
      this.toast(err);
    },true);

  }

  getFlowedList(){
    this.net.httpPost(AppGlobal.API.flowProgress,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":11
    },msg=>{
      let info = JSON.parse(msg);
      this.flowedList = info.subList;
    },err=>{
      this.toast(err);
    },true);

  }

  goToSpleDetail(sple){
    this.navCtrl.push("FlowSpleInfoPage",{spleId:sple.SubSampleId});
  }
}
