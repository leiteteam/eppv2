import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Events } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppServiceProvider, AppGlobal } from '../../providers/app-service/app-service';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';

/**
 * Generated class for the CollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage extends BasePage{
  tabIndex:number = 0;
  spleCategory: any = "todo";
  spleType = "main";
  tabList = [{name:"todo",count:4},{name:"done",count:0},{name:"uploaded",count:0},{name:"togo",count:0}];
  todoList:any[] = [];
  doneList:any[] = [];
  uploadedList:any[] = [];
  togoList:any[] = [];

  flowedMainSpleList:any[] = [];
  flowedSubSpleList:any[] = [];

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
    public events:Events,
    public device:DeviceIntefaceServiceProvider) {
    super(navCtrl,navParams,toastCtrl);
    events.subscribe('tabChanged',(data)=>{
      this.getTodoList();
      if(data != null){
        this.segmentClick(data.type);
      }
    });
  }

  onCllect(spleTask){
    this.navCtrl.push('CollectProcessPage', {'spleTask':spleTask, model: 0});
  }
  goUpdateTask(spleTask){
    this.navCtrl.push('CollectProcessPage', {'spleTask':spleTask, model: 1});
  }
  goToView(spleTask){
    this.navCtrl.push('SampleInfoPage', {'taskData':spleTask});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionPage');
    this.getTodoList();
  }

  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    if (this.tabIndex == 0){
      this.getTodoList(refresher);
    }

    if (this.tabIndex == 1){
      this.getDoneList(refresher);
    }

    if (this.tabIndex == 2){
      this.getUploadedList(refresher);
    }

    if (this.tabIndex == 3){
      this.getFlowedList(refresher);
    }
  }

  segmentClick(index:number) {
    //alert(this.dictCode[item]);
    this.tabIndex = index;
    this.spleCategory = this.tabList[index].name;
    if (index == 0){
      this.getTodoList();
    }

    if (index == 1){
      this.getDoneList();
    }

    if (index == 2){
      this.getUploadedList();
    }

    if (index == 3){
      this.getFlowedList();
    }
  }

  getTodoList(refresher?){
    this.device.push(
      "getTodoList",
      AppServiceProvider.getInstance().userinfo.username,
      (taskList)=>{
        //console.log(JSON.stringify(taskList));
        this.todoList = [];
        taskList.forEach(element => {
          let task = JSON.parse(element);
          task.data = JSON.parse(task.data);
          if (task.samples){
            task.samples = JSON.parse(task.samples);
          }
          this.todoList.push(task);
        });
        this.refreshDone(refresher);
      },
      (err)=>{
        this.toast(err);
        this.refreshDone(refresher);
      }
      ,true
    );
  }

  getDoneList(refresher?){
    this.device.push(
      "getDoneList",
      AppServiceProvider.getInstance().userinfo.username,
      (taskList)=>{
        this.doneList = [];
        taskList.forEach(element => {
          let task = JSON.parse(element);
          task.data = JSON.parse(task.data);
          if (task.samples){
            task.samples = JSON.parse(task.samples);
          }
          this.doneList.push(task);
        });
        this.refreshDone(refresher);
      },
      (err)=>{
        this.toast(err);
        this.refreshDone(refresher);
      }
      ,true
    );
  }

  spleDetail(sple,isSub){
    const profileModal = this.modalCtrl.create("SpleStationInfoPage", { sple: sple,isSub:isSub }, { showBackdrop: false }, );
    profileModal.present();
  }

  tryToNavi(task){
    if (this.spleCategory == 'todo'){
      this.device.push("startTracing",task.taskid,success=>{
        this.navigation(task);
      });
    }else {
      this.navigation(task);
    }
  }

  navigation(task){
    if (task.data){
      this.device.push( "navigation", {lat:task.data.Point.Latitude,lng:task.data.Point.Longitude} );
    }
    if (task.Point){
      this.device.push( "navigation", {lat:task.Point.Latitude,lng:task.Point.Longitude} );
    }
  }

  getUploadedList(refresher?){
    return new Promise((resolve, reject) => {
      this.net.httpPost(
        AppGlobal.API.taskList,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token": AppServiceProvider.getInstance().userinfo.token,
          "statu":4
        },
        msg => {
          console.log(msg);
    
          let info = JSON.parse(msg);
          //清空缓存待下载任务列表
          AppServiceProvider.getInstance().uploadedTaskList = [];
          this.uploadedList = [];
          if (info.Tasks.length == 0){
            reject();
          }
          let category = info.category;
          info.Tasks.forEach(element => {
            let task:any = element;
            task.category = category;
            task.GroupName = info.GroupName;
            task.GroupMember = info.GroupMember;
            // 1 待下载 2 待采样 4 已上传 5 已撤回
            // 两重确保服务器数据不会混乱
            if (task.SampleStatus == 4){
              AppServiceProvider.getInstance().uploadedTaskList.push(task);
              this.uploadedList.push(task);
            }
          });
          this.refreshDone(refresher);
          resolve();
        },
        error => {
          this.toastShort(error);
          this.refreshDone(refresher);
        },
        true);
    });
  }

  getFlowedList(refresher?){
    this.net.httpPost(
      AppGlobal.API.flowedList,
      {
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token
      },
      msg => {
        console.log(msg);
        let info = JSON.parse(msg);
        this.flowedMainSpleList = info.MainSamples;
        this.flowedSubSpleList = info.SubSamples;

        this.refreshDone(refresher);
      },
      error => {
        this.toastShort(error);
        this.refreshDone(refresher);
      },
      true);
  }

  refreshDone(refresher){
    if (refresher){
      refresher.complete();
    }
  }
}
