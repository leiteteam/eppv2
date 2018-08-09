import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AppServiceProvider, AppGlobal } from '../../providers/app-service/app-service';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';

/**
 * Generated class for the TaskSummaryDialogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-summary-dialog',
  templateUrl: 'task-summary-dialog.html',
})
export class TaskSummaryDialogPage extends BasePage{
  
  spleTeam:string = "";
  teamMember:string = "";
  uploaded:number = 0;
  doing:number = 0;
  undown:number = 0;
  returned:number = 0;

  constructor(public net:TyNetworkServiceProvider,public toastCtrl:ToastController,public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskSummaryDialogPage');
      this.spleTeam = AppServiceProvider.getInstance().spleTeam;
      this.teamMember = AppServiceProvider.getInstance().teamMember;

      this.requestTaskSummary();
  }

  gotoSampleList(){
    
  }
  gotoDataManager(){

  }
  
  requestTaskSummary(){
    return new Promise((resolve, reject) => {
      this.net.httpPost(
        AppGlobal.API.taskSummary,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token": AppServiceProvider.getInstance().userinfo.token
        },
        msg => {
          console.log(msg);
          let ret = JSON.parse(msg);
          let counts = ret.counts;
          this.undown = counts.WaitDownload;
          this.doing = counts.WaitSampling;
          this.uploaded = counts.UploadFinished;
          this.returned = counts.Back;
          resolve();
        },
        error => {
          //this.toastShort(error);
          this.uploaded = AppServiceProvider.getInstance().uploadedTaskList.length;
          this.doing = AppServiceProvider.getInstance().downloadedTaskList.length;
          this.undown = AppServiceProvider.getInstance().undownTaskList.length;
          this.returned = AppServiceProvider.getInstance().returnedTaskList.length;
        },
        true);
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
