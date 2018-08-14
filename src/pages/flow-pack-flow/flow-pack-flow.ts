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

  spleNo:string = "";
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

  /**
   * 监听键盘enter键
   * @param event 
   */
  onkey(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.flow(this.spleNo);
      return false;
    }
  }

  scan(){
    this.device.push("qrCodeScan",'',(spleNo)=>{
      console.log("spleNo:"+spleNo);
      this.spleNo = spleNo;
      this.flow(spleNo);
    },(err)=>{
      this.toastShort(err);
    });
  }

  flow(spleNo){
    this.net.httpPost(
      AppGlobal.API.flowPackFlow,
      {
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        'sampleCode':spleNo
      },
      msg => {
        console.log(msg);
        this.flowList.push(JSON.parse(msg));
      },
      error => {
        this.toast(error);
      },
      true);
  }

}
