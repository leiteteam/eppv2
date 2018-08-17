import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

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

  tabIndex:number = 0;
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

  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    if (this.tabIndex == 0){
      this.getAcceptList(refresher);
    }

    if (this.tabIndex == 1){
      this.getPrepareList(refresher);
    }

    if (this.tabIndex == 2){
      this.getFlowList(refresher);
    }

    if (this.tabIndex == 3){
      this.getFlowedList(refresher);
    }
  }

  segmentClick(index:number) {
    //alert(this.dictCode[item]);
    this.tabIndex = index;
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

  getAcceptList(refresher?){
    this.net.httpPost(AppGlobal.API.progressList,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":6
    },msg=>{
      let info = JSON.parse(msg);
      this.acceptList = info.ProgList;
      this.refreshDone(refresher);
    },err=>{
      this.toast(err);
      this.refreshDone(refresher);
    },true);
  }

  getPrepareList(refresher?){
    this.net.httpPost(AppGlobal.API.progressList,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":7
    },msg=>{
      let info = JSON.parse(msg);
      this.prepareList = info.ProgList;
      this.refreshDone(refresher);
    },err=>{
      this.toast(err);
      this.refreshDone(refresher);
    },true);

  }

  spleDetail(sple,isSub){
    const profileModal = this.modalCtrl.create("SpleStationInfoPage", { sple: sple,isSub:isSub }, { showBackdrop: false }, );
    profileModal.present();
  }

  getFlowList(refresher?){
    return new Promise((resolve, reject) => {
      this.net.httpPost(AppGlobal.API.progressList,{
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        "statu":8
      },msg=>{
        let info = JSON.parse(msg);
        this.flowList = info.ProgList;
        this.refreshDone(refresher);
      },err=>{
        this.toast(err);
        this.refreshDone(refresher);
      },true);

    });
  }

  getFlowedList(refresher?){
    this.net.httpPost(AppGlobal.API.progressList,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":9
    },msg=>{
      let info = JSON.parse(msg);
      this.flowedList = info.ProgList;
      this.refreshDone(refresher);
    },err=>{
      this.toast(err);
      this.refreshDone(refresher);
    },true);

  }

  goToSpleDetail(sple){
    this.navCtrl.push("PrepSpleInfoPage",{taskid:sple.TaskID});
  }

  refreshDone(refresher){
    if (refresher){
      refresher.complete();
    }
  }
}
