import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';

/**
 * Generated class for the DataManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-manager',
  templateUrl: 'data-manager.html',
})
export class DataManagerPage extends BasePage{

  tobeDownloadedNum:number = 0;

  undoneCountNum:number = 0;
  doneCountNum:number = 0;

  successNum:number = 0;
  failNum:number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private net: TyNetworkServiceProvider,
    private device: DeviceIntefaceServiceProvider,
    public toastCtrl: ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataManagerPage');
    this.tobeDownloadedNum = AppServiceProvider.getInstance().undownTaskList.length;
    this.countTask();
  }

  download(){
    this.requestUndoneTasks()
    .then(()=>{
      return this.updateUndoneTask();
    })
    .then(()=>{
      return this.notifyDownloadSuccess()
    })
    .then(()=>{
      this.countTask();
    });
  }

  requestUndoneTasks(){
    return new Promise((resolve, reject) => {
      this.net.httpPost(
        AppGlobal.API.taskList,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token": AppServiceProvider.getInstance().userinfo.token,
          "statu":1
        },
        msg => {
          console.log(msg);
    
          let info = JSON.parse(msg);
          //清空缓存待下载任务列表
          AppServiceProvider.getInstance().undownTaskList = [];
          AppServiceProvider.getInstance().newTaskList = [];
          AppServiceProvider.getInstance().returnedTaskList = [];

          if (info.Tasks.length == 0){
            this.toast("当前已无待下载任务。");
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
            if (task.SampleStatus == 1){
              AppServiceProvider.getInstance().newTaskList.push(task);
            }
            if (task.SampleStatus == 5){
              AppServiceProvider.getInstance().returnedTaskList.push(task);
            }
            AppServiceProvider.getInstance().undownTaskList.push(task);
          });
          resolve();
        },
        error => {
          this.toastShort(error);
        },
        true);
    });
  }

  updateUndoneTask(){
    let taskDataList:any[] = [];

    AppServiceProvider.getInstance().undownTaskList.forEach(element => {
      
      let taskData:any = {};
      taskData.taskid = element.TaskID;
      taskData.userid = AppServiceProvider.getInstance().userinfo.username;
      taskData.data = JSON.stringify(element);
      taskData.state = 0;
      taskDataList.push(taskData);
    });
    return new Promise((resolve,reject)=>{
      this.device.push(
        "downloadTask",
        JSON.stringify(taskDataList),
        (success)=>{
          resolve();
        },
        (err)=>{
          this.toastShort(err);
        },true
      );
    });
  }

  notifyDownloadSuccess(){
      return new Promise((resolve,reject)=>{
      let status:any[] = [];
      AppServiceProvider.getInstance().undownTaskList.forEach(element => {
        status.push({
          TaskID:element.TaskID,
          Statu:2
        });
      });
      this.net.httpPost(
        AppGlobal.API.notifyDownloadSuccess,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token": AppServiceProvider.getInstance().userinfo.token,
          "status":status
        },
        msg => {
          console.log(msg);
          AppServiceProvider.getInstance().undownTaskList = [];
          this.tobeDownloadedNum = 0;
          resolve();
        },
        error => {
          this.toastShort(error);
          AppServiceProvider.getInstance().undownTaskList = [];
          this.tobeDownloadedNum = 0;
          resolve();
        },
        true);
    });
  }

  countTask(){
    return new Promise((resolve,reject)=>{
      this.device.push(
        "countTask",
        AppServiceProvider.getInstance().userinfo.username,
        (success)=>{
          this.undoneCountNum = success.undoneCountNum;
          this.doneCountNum = success.doneCountNum;
        },
        (err)=>{
          //this.toastShort(err);
        },
        false
      );
    });
  }

  upload(){
    this.getDoneTaskList()
    .then((taskList)=>{
      return this.uploadSamples(taskList);
    })
    .then((taskidList)=>{
      return this.updateTaskToUploaded(taskidList);
    });
  }

  getDoneTaskList(){
    return new Promise((resolve,reject)=>{
      this.device.push(
        "getDoneList",
        AppServiceProvider.getInstance().userinfo.username,
        (taskList)=>{
          if (taskList == null || taskList.length == 0){
            this.toast("当前尚无待上传任务。");
          }else {
            resolve(taskList);
          }
        },
        (err)=>{
          this.toast(err);
        }
        ,true
      );
    });
  }

  uploadSamples(taskList){
    return new Promise((resolve,reject)=>{
      let spleList:any[] = [];
      let taskidList:string[] = [];
      taskList.forEach(element => {
        let task = JSON.parse(element);
        task.data = JSON.parse(task.data);
        if (task.samples){
          task.samples = JSON.parse(task.samples);
        }
        taskidList.push(task.taskid);
        spleList.push(task.samples);
      });

      this.net.httpPost(
        AppGlobal.API.uploadSamples,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token": AppServiceProvider.getInstance().userinfo.token,
          "samples":spleList
        },
        msg => {
          console.log(msg);
          this.doneCountNum = 0;
          this.successNum = taskidList.length;
          this.failNum = 0;
          resolve(taskidList);
        },
        error => {
          this.toastShort(error);
          this.successNum = 0;
          this.failNum = taskidList.length;
        },
        true);
    });
  }

  updateTaskToUploaded(taskidList){
    this.device.push("updateTaskDataToUploaded",JSON.stringify(taskidList),success=>{
      this.toast("上传成功!");
    });
  }

}
