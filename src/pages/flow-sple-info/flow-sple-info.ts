import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal } from '../../providers/app-service/app-service';

/**
 * Generated class for the FlowSpleInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flow-sple-info',
  templateUrl: 'flow-sple-info.html',
})
export class FlowSpleInfoPage extends BasePage{
  spleId:string;
  size:number = 2;
  require:string = "样品制备过程要尽可能使每一份样品都是均匀地来自该样品总量.";
  method:string = "分样法";
  spleMain:any = {};
  spleSub:any = {};

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
      this.spleId = navParams.data.spleId;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlowSpleInfoPage');
    this.getSpleDetail();
  }

  getSpleDetail(){
    this.net.httpPost(AppGlobal.API.flowSpleDetail,{
      "SubSampleId":this.spleId
    },msg=>{
      let info = JSON.parse(msg);
      this.spleMain = info.MainSample;
      this.spleSub = info.SubSample;
    },err=>{
      this.toast(err);
    },true);
  }
}
