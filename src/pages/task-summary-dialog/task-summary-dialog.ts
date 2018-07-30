import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppServiceProvider } from '../../providers/app-service/app-service';

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
export class TaskSummaryDialogPage {
  
  spleTeam:string = "";
  teamMember:string = "";
  uploaded:number = 0;
  doing:number = 0;
  undown:number = 0;
  returned:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskSummaryDialogPage');
      this.spleTeam = AppServiceProvider.getInstance().spleTeam;
      this.teamMember = AppServiceProvider.getInstance().teamMember;

      this.uploaded = AppServiceProvider.getInstance().uploadedTaskList.length;
      this.doing = AppServiceProvider.getInstance().downloadedTaskList.length;
      this.undown = AppServiceProvider.getInstance().undownTaskList.length;
      this.returned = AppServiceProvider.getInstance().returnedTaskList.length;
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
