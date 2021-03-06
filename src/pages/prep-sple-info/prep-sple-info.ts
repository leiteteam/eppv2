import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal } from '../../providers/app-service/app-service';

/**
 * Generated class for the PrepSpleInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prep-sple-info',
  templateUrl: 'prep-sple-info.html',
})
export class PrepSpleInfoPage extends BasePage{
  taskid:string;
  size:number = 2;
  require:string = "样品制备过程要尽可能使每一份样品都是均匀地来自该样品总量.";
  sple:any = {};

  SampleCategorys = {
    "1":"表层土壤",
    "2":"深层土壤",
    "3":"水稻",
    "4":"小麦",
    "5":"蔬菜及其他农产品",
    "6":"其他"
  };

  constructor(
    private net: TyNetworkServiceProvider,
    public toastCtrl:ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      super(navCtrl,navParams,toastCtrl);
      this.taskid = navParams.data.taskid;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepSpleInfoPage');
    this.getSpleDetail();
  }

  getSpleDetail(){
    this.net.httpPost(AppGlobal.API.prepSpleDetail,{
      "TaskID":this.taskid
    },msg=>{
      this.sple = JSON.parse(msg);
    },err=>{
      this.toast(err);
    },true);
  }
}
