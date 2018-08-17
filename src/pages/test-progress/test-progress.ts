import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the TestProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-progress',
  templateUrl: 'test-progress.html',
})
export class TestProgressPage extends BasePage{

  tabIndex:number = 0;
  progCategory: any = "accept";
  spleType = "main";
  tabList = [{name:"accept",count:4},{name:"test",count:0},{name:"tested",count:0},{name:"reported",count:0}];
  acceptList:any[] = [];
  testList:any[] = [];
  testedList:any[] = [];
  reportedList:any[] = [];

  testItems: any = { '1': '仅多环芳烃','2': '含多环芳烃','3': '无多环芳烃','4': '氰化物', '5': '无机包'};
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
    console.log('ionViewDidLoad TestProgressPage');
    this.getAcceptList();
  }

  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    if (this.tabIndex == 0){
      this.getAcceptList(refresher);
    }

    if (this.tabIndex == 1){
      this.getTestList(refresher);
    }

    if (this.tabIndex == 2){
      this.getTestedList(refresher);
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
      this.getTestList();
    }

    if (index == 2){
      this.getTestedList();
    }

    if (index == 3){
      this.getReportedList();
    }
  }

  getAcceptList(refresher?){
    this.net.httpPost(AppGlobal.API.testProgressAcc,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token
    },msg=>{
      let info = JSON.parse(msg);
      this.acceptList = info.list;
      this.refreshDone(refresher);
    },err=>{
      this.toast(err);
      this.refreshDone(refresher);
    },true);
  }

  getTestList(refresher?){
    this.net.httpPost(AppGlobal.API.testProgress,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":12
    },msg=>{
      let info = JSON.parse(msg);
      this.testList = info.list;
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

  getTestedList(refresher?){
    return new Promise((resolve, reject) => {
      this.net.httpPost(AppGlobal.API.testProgress,{
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        "statu":13
      },msg=>{
        let info = JSON.parse(msg);
        this.testedList = info.list;
        this.refreshDone(refresher);
      },err=>{
        this.toast(err);
        this.refreshDone(refresher);
      },true);

    });
  }

  getReportedList(refresher?){
    this.net.httpPost(AppGlobal.API.testProgress,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "statu":14
    },msg=>{
      let info = JSON.parse(msg);
      this.reportedList = info.list;
      this.refreshDone(refresher);
    },err=>{
      this.toast(err);
      this.refreshDone(refresher);
    },true);

  }

  goToAccSpleDetail(sple){
    this.navCtrl.push("TestAccPackInfoPage",{packNo:sple.PackageCode});
  }

  goToTestSpleDetail(sple){
    this.navCtrl.push("TestTestingSpleInfoPage",{packNo:sple.TwoSampleId});
  }

  refreshDone(refresher){
    if (refresher){
      refresher.complete();
    }
  }
}
