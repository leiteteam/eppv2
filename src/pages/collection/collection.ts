import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
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
  spleCategory: any = "todo";
  spleType = "main";
  tabList = [{name:"todo",count:4},{name:"done",count:0},{name:"uploaded",count:0},{name:"togo",count:0}];
  todoList:any[] = [];
  doneList:any[] = [];
  uploadedList:any[] = [];
  togoList:any[] = [];

  mainSpleTogoList = [
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    }
  ];

  subSpleTogoList = [
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    }
  ];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController,
    public modalCtrl: ModalController,
    private net: TyNetworkServiceProvider,
    public device:DeviceIntefaceServiceProvider) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionPage');
    this.getTodoList();
  }

  segmentClick(index:number) {
    //alert(this.dictCode[item]);
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
      
    }
  }

  getTodoList(){
    this.device.push(
      "getTodoList",
      AppServiceProvider.getInstance().userinfo.username,
      (taskList)=>{
        //console.log(JSON.stringify(taskList));
        taskList.forEach(element => {
          let task = JSON.parse(element);
          task.data = JSON.parse(task.data);
          if (task.samples){
            task.samples = JSON.parse(task.samples);
          }
          this.todoList.push(task);
        });
      },
      (err)=>{
        this.toast(err);
      }
      ,true
    );
  }

  getDoneList(){
    this.device.push(
      "getDoneList",
      AppServiceProvider.getInstance().userinfo.username,
      (taskList)=>{
        taskList.forEach(element => {
          let task = JSON.parse(element);
          task.data = JSON.parse(task.data);
          if (task.samples){
            task.samples = JSON.parse(task.samples);
          }
          this.doneList.push(task);
        });
      },
      (err)=>{
        this.toast(err);
      }
      ,true
    );
  }

  spleDetail(sple){
    const profileModal = this.modalCtrl.create("SpleStationInfoPage", { sple: sple }, { showBackdrop: false }, );
    profileModal.present();
  }

  navigation(task){
    if (task.data){
      this.device.push( "navigation", {lat:task.data.Point.Latitude,lng:task.data.Point.Longitude} );
    }
    if (task.Point){
      this.device.push( "navigation", {lat:task.Point.Latitude,lng:task.Point.Longitude} );
    }
  }

  getUploadedList(){
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
          resolve();
        },
        error => {
          this.toastShort(error);
        },
        true);
    });
  }
}
