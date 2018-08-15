import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the FlowPackFlowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flow-pack-flow',
  templateUrl: 'flow-pack-flow.html',
})
export class FlowPackFlowPage extends BasePage{
  packCates: any = { '1': '普通检测样包', '2': '实验室间质控样包', '3': '入库包'};
  spleCates: any = { '1': '表层土壤','2': '深层土壤' ,'3': '农产品' };
  testItems: any = { '1': '仅多环芳烃','2': '含多环芳烃','3': '无多环芳烃','4': '氰化物', '5': '入库无机包'};
  status: any = { '1': '可用','2': '已封包', '3': '已流转','4': '已接收'};

  packNo:string = "";
  flowList = [];

  constructor(
    public net:TyNetworkServiceProvider,
    public device:DeviceIntefaceServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlowPackFlowPage');
  }

  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    this.flowList = [];
    if (refresher != null) {
      refresher.complete();
    }
  }

  /**
   * 监听键盘enter键
   * @param event 
   */
  onkey(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.flow(this.packNo);
      return false;
    }
  }

  scan(){
    this.device.push("qrCodeScan",'',(packNo)=>{
      console.log("spleNo:"+packNo);
      this.packNo = packNo;
      this.flow(packNo);
    },(err)=>{
      this.toastShort(err);
    });
  }

  flow(packNo){
    this.net.httpPost(
      AppGlobal.API.flowPackFlow,
      {
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        'PackageCode':packNo
      },
      msg => {
        console.log(msg);
        let info = JSON.parse(msg);
        this.flowList.push(info.package);
      },
      error => {
        this.toast(error);
      },
      true);
  }

}
