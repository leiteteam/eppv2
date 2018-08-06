import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the PrepProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prep-progress',
  templateUrl: 'prep-progress.html',
})
export class PrepProgressPage extends BasePage{

  progCategory: any = "accept";
  spleType = "main";
  tabList = [{name:"accept",count:4},{name:"prepare",count:0},{name:"flow",count:0},{name:"flowed",count:0}];
  acceptList:any[] = [];
  prepareList:any[] = [];
  flowList:any[] = [];
  flowedList:any[] = [];

  SampleCategorys = {
    "1":"表层土壤",
    "2":"深层土壤",
    "3":"水稻",
    "4":"小麦",
    "5":"蔬菜及其他农产品",
    "6":"其他"
  };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController,
    public modalCtrl: ModalController,
    private net: TyNetworkServiceProvider,
    public device:DeviceIntefaceServiceProvider) {
    super(navCtrl,navParams,toastCtrl);

  }

  onCllect(spleTask){
    this.navCtrl.push('CollectProcessPage', {'spleTask':spleTask, model: 0});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionPage');
    this.getAcceptList();
  }

  segmentClick(index:number) {
    //alert(this.dictCode[item]);
    this.progCategory = this.tabList[index].name;
    if (index == 0){
      this.getAcceptList();
    }

    if (index == 1){
      this.getPrepareList();
    }

    if (index == 2){
      this.getFlowList();
    }

    if (index == 3){
      this.getFlowedList();
    }
  }

  getAcceptList(){
    // this.net.httpPost(
    //   AppGlobal.API.flowedList,
    //   {
    //     "username": AppServiceProvider.getInstance().userinfo.username,
    //     "token": AppServiceProvider.getInstance().userinfo.token
    //   },
    //   msg => {
    //     console.log(msg);
    //     let info = JSON.parse(msg);
    //     this.flowedList = info.MainSamples;
    //   },
    //   error => {
    //     this.toastShort(error);
    //   },
    //   true);
    this.acceptList = [{SampleNum:3,SampleNumber:"47568939032FGDYEw434",date:"2017-09-12 13:30:00",SampleCategory:"1"},
    {SampleNum:3,SampleNumber:"47568939032FGDYEw434",date:"2017-09-12 13:30:00",SampleCategory:"1"}];
  }

  getPrepareList(){
    // this.net.httpPost(
    //   AppGlobal.API.flowedList,
    //   {
    //     "username": AppServiceProvider.getInstance().userinfo.username,
    //     "token": AppServiceProvider.getInstance().userinfo.token
    //   },
    //   msg => {
    //     console.log(msg);
    //     let info = JSON.parse(msg);
    //     this.flowedList = info.MainSamples;
    //   },
    //   error => {
    //     this.toastShort(error);
    //   },
    //   true);
    this.prepareList = [{SampleNum:3,SampleNumber:"47568939032FGDYEw434",date:"2017-09-12 13:30:00",SampleCategory:"1"},
    {SampleNum:3,SampleNumber:"47568939032FGDYEw434",date:"2017-09-12 13:30:00",SampleCategory:"1"}];
  }

  spleDetail(sple,isSub){
    const profileModal = this.modalCtrl.create("SpleStationInfoPage", { sple: sple,isSub:isSub }, { showBackdrop: false }, );
    profileModal.present();
  }

  getFlowList(){
    return new Promise((resolve, reject) => {
      // this.net.httpPost(
      //   AppGlobal.API.taskList,
      //   {
      //     "username": AppServiceProvider.getInstance().userinfo.username,
      //     "token": AppServiceProvider.getInstance().userinfo.token,
      //     "statu":4
      //   },
      //   msg => {
      //     console.log(msg);
    
      //     let info = JSON.parse(msg);

      //     resolve();
      //   },
      //   error => {
      //     this.toastShort(error);
      //   },
      //   true);
      this.flowList = [{SampleNum:3,SampleNumber:"47568939032FGDYEw434",center:"大连中心07",test:"种植果园",ctrl:"是"},
    {SampleNum:3,SampleNumber:"47568389032FGDYEw434",center:"大连中心08",test:"种植果园",ctrl:"是"}];
    });
  }

  getFlowedList(){
    // this.net.httpPost(
    //   AppGlobal.API.flowedList,
    //   {
    //     "username": AppServiceProvider.getInstance().userinfo.username,
    //     "token": AppServiceProvider.getInstance().userinfo.token
    //   },
    //   msg => {
    //     console.log(msg);
    //     let info = JSON.parse(msg);
    //     this.flowedList = info.MainSamples;
    //   },
    //   error => {
    //     this.toastShort(error);
    //   },
    //   true);
    this.flowedList = [{SampleNum:3,SampleNumber:"4756838939032FGDYEw434",center:"大连中心01",test:"种植果园",ctrl:"是"},
    {SampleNum:3,SampleNumber:"4756838939032FGDYEw434",center:"大连中心01",test:"种植果园",ctrl:"是"}];
  }

}
