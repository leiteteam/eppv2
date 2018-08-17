import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the PrepSpleAcceptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prep-sple-accept',
  templateUrl: 'prep-sple-accept.html',
})
export class PrepSpleAcceptPage  extends BasePage{

  SampleCategorys = {
    "1":"表层土壤",
    "2":"深层土壤",
    "3":"水稻",
    "4":"小麦",
    "5":"蔬菜及其他农产品",
    "6":"其他"
  };

  spleNo:string = "";
  acceptList:any = [];

  constructor(
    public device:DeviceIntefaceServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepSpleAcceptPage');
  }


  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    this.acceptList = [];
    refresher.complete();
  }

  /**
   * 监听键盘enter键
   * @param event 
   */
  onkey(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.navCtrl.push("PrepSpleCheckPage",{spleId:this.spleNo,callback:this.callback});
      return false;
    }
  }

  accept(){
    this.device.push("qrCodeScan",'',(spleNo)=>{
      console.log("spleNo:"+spleNo);
      this.spleNo = spleNo;
      this.navCtrl.push("PrepSpleCheckPage",{spleId:spleNo,callback:this.callback});
    },(err)=>{
      this.toastShort(err);
    });
  }

  //选择条件回调
  callback = (sple) => {
    console.log("callback success-->add sple");
    this.acceptList.push(sple);
  }
}
