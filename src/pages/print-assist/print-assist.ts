import { PrintServiceProvider } from './../../providers/print-service/print-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal } from '../../providers/app-service/app-service';

/**
 * Generated class for the PrintAssistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-print-assist',
  templateUrl: 'print-assist.html',
})
export class PrintAssistPage extends BasePage{

  packNo:string = "";
  pack:any = {
    SampleCode:"",
    SubSampleId:"",
    TwoSampleId:""
  };

  constructor(
    public net:TyNetworkServiceProvider,
    public device:DeviceIntefaceServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController, 
    public prints: PrintServiceProvider) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrintAssistPage');
  }

  /**
   * 监听键盘enter键
   * @param event 
   */
  onkey(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.query(this.packNo);
      return false;
    }
  }

  scan(){
    this.device.push("qrCodeScan",'',(packNo)=>{
      console.log("packNo:"+packNo);
      this.packNo = packNo;
      this.query(packNo);
    },(err)=>{
      this.toastShort(err);
    });
  }

  query(spleNo){
    this.net.httpPost(
      AppGlobal.API.printAssist,
      {
        'SampleCode':spleNo
      },
      msg => {
        console.log(msg);
        this.pack = JSON.parse(msg);
      },
      error => {
        this.toast(error);
        this.reset();
      },
      true);
  }

  print(code){
    this.prints.print(code, code);
    // this.device.push("printInit","",msg =>{
    //   console.log("push success");
    //   this.device.push("print",code,msg =>{
    //     console.log("push success");
    //   },err => {
    //     this.toast(err);
    //     console.log("push failed");
    //   });
    // },err => {
    //   this.toast(err);
    //   console.log("push failed");
    // });
  }

  reset(){
    this.pack = {
      SampleCode:"",
      SubSampleId:"",
      TwoSampleId:""
    };
  }
}
