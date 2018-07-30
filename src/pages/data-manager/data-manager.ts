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
    this.countTask();
  }

  download(){
    this.requestUndoneTasks()
    .then(()=>{
      return this.updateUndoneTask();
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
          "token": AppServiceProvider.getInstance().userinfo.token
        },
        msg => {
          console.log(msg);
    
          let info = JSON.parse(msg);
          let category = info.category;
          AppServiceProvider.getInstance().undownTaskList = [];
          AppServiceProvider.getInstance().downloadedTaskList = [];
          AppServiceProvider.getInstance().uploadedTaskList = [];
          AppServiceProvider.getInstance().returnedTaskList = [];

          info.Tasks.forEach(element => {
            let task:any = element;
            task.category = category;
            task.GroupName = info.GroupName;
            task.GroupMember = info.GroupMember;
            // 1 待下载 2 待采样 3 已上传 4 已撤回
            if (task.SampleStatus == 1){
              AppServiceProvider.getInstance().undownTaskList.push(task);
            }
            if (task.SampleStatus == 2){
              //do nothing...改状态由本地维护，直到本地上传成功
              AppServiceProvider.getInstance().downloadedTaskList.push(task);
            }
            if (task.SampleStatus == 3){
              AppServiceProvider.getInstance().uploadedTaskList.push(task);
            }
            if (task.SampleStatus == 4){
              AppServiceProvider.getInstance().returnedTaskList.push(task);
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

  countTask(){
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
  }

}
