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

  undoneCountNum:number = 0;
  doneCountNum:number = 0;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private net: TyNetworkServiceProvider,
    private device: DeviceIntefaceServiceProvider,
    public toastCtrl: ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataManagerPage');
  }

  download(){
    return new Promise((resolve, reject) => {
      this.net.httpPost(
        AppGlobal.API.taskList,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token ": AppServiceProvider.getInstance().userinfo.token
        },
        msg => {
          console.log(msg);
          resolve(msg);
        },
        error => {
          this.toastShort(error);
        },
        true);
    });
  }

  updateUndoneTask(msg){
    return new Promise((resolve,reject)=>{
      this.device.push(
        "undoneTask",
        JSON.stringify({
          username:AppServiceProvider.getInstance().userinfo.username,
          taskList:msg
        }),
        (success)=>{
          resolve();
        },
        (err)=>{
          this.toastShort(err);
        }
      );
    });
  }

  countTask(){
    this.device.push(
      "countTask",
      {
        username:AppServiceProvider.getInstance().userinfo.username
      },
      (success)=>{
        this.undoneCountNum = success.undoneCountNum;
        this.doneCountNum = success.doneCountNum;
      },
      (err)=>{
        this.toastShort(err);
      }
    );
  }

}
