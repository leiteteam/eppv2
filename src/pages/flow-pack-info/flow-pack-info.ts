import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the FlowPackInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flow-pack-info',
  templateUrl: 'flow-pack-info.html',
})
export class FlowPackInfoPage extends BasePage{

  packNo:string = "";
  spleNo:string = "";
  pack:any = {};
  subSpleList:any[] = [];

  packCates: any = { '1': '普通检测样包', '2': '实验室间质控样包', '3': '入库包'};

  spleCates: any = { '1': '表层土壤','2': '深层土壤' ,'3': '农产品' };

  testItems: any = { '1': '仅多环芳烃','2': '含多环芳烃','3': '无多环芳烃','4': '氰化物', '5': '入库无机包'};

  status: any = { '1': '可用','2': '已封包', '3': '已流转','4': '已接收'};

  constructor(
    public device :DeviceIntefaceServiceProvider,
    public net:TyNetworkServiceProvider,
    public alert:AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlowPackInfoPage');
    this.packNo = this.navParams.data.packNo;
    this.flowPackInfo();
  }

  flowPackInfo(){
    this.net.httpPost(AppGlobal.API.flowPackInfo,{
      "PackageCode": this.packNo
    },(msg)=>{
      this.pack = JSON.parse(msg);
      this.subSpleList = this.pack.details;
    },err=>{
      this.toast(err);
    },true);
  }

  /**
   * 监听键盘enter键
   * @param event 
   */
  onkey(event) {
    if (!this.pack || this.pack.Status == 3){
      return false;
    }
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.addSple(this.spleNo);
      return false;
    }
  }

  scan(){
    if (!this.pack || this.pack.Status == 3 || this.pack.Status == 2){
      this.toastShort("样包已封包或已流转后不可再添加子样");
      return;
    }
    this.device.push("qrCodeScan",'',(spleNo)=>{
      console.log("spleNo:"+spleNo);
      this.spleNo = spleNo;
      this.addSple(spleNo);
    },(err)=>{
      this.toastShort(err);
    });
  }

  addSple(spleNo){
    this.net.httpPost(AppGlobal.API.flowPackAddSple,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "PackageCode": this.packNo,
      "SubSampleId":spleNo
    },(msg)=>{
      let info = JSON.parse(msg);
      this.subSpleList = info.details;
    },err=>{
      this.toast(err);
    },true);
  }

  packing(isUnpack:boolean){
    let alert = this.alert.create({
      title:isUnpack?'您是否确定进行解包操作？':'您是否确定进行封包操作？',
      buttons:[{
        text:'取消'
      },{
        text:'确定',
        handler:()=>{
          this.net.httpPost(AppGlobal.API.flowPacking,{
            "username": AppServiceProvider.getInstance().userinfo.username,
            "token": AppServiceProvider.getInstance().userinfo.token,
            "Statu":isUnpack?"1":"2",
            "PackageCode":this.packNo
          },(msg)=>{
            this.flowPackInfo();
          },err=>{
            this.toast(err);
          },true);
        }
      }],
      enableBackdropDismiss:false
    });

    alert.present();
  }

  delPack(){
    let alert = this.alert.create({
      title:'您确定删除该样包吗？',
      buttons:[{
        text:'取消'
      },{
        text:'确定',
        handler:()=>{
          this.net.httpPost(AppGlobal.API.flowPackDel,{
            "username": AppServiceProvider.getInstance().userinfo.username,
            "token": AppServiceProvider.getInstance().userinfo.token,
            "PackageCodeOrSubSampleId":this.packNo
          },(msg)=>{
            this.navCtrl.pop();
          },err=>{
            this.toast(err);
          },true);
        }
      }],
      enableBackdropDismiss:false
    });

    alert.present();
  }

  delSple(sple){
    let alert = this.alert.create({
      title:'您确定删除该样品吗？',
      buttons:[{
        text:'取消'
      },{
        text:'确定',
        handler:()=>{
          this.net.httpPost(AppGlobal.API.flowPackDelSple,{
            "username": AppServiceProvider.getInstance().userinfo.username,
            "token": AppServiceProvider.getInstance().userinfo.token,
            "PackageCodeOrSubSampleId":sple.SubSampleId
          },(msg)=>{
            let index = this.subSpleList.indexOf(sple);
            this.subSpleList.splice(index,1);
          },err=>{
            this.toast(err);
          },true);
        }
      }],
      enableBackdropDismiss:false
    });

    alert.present();
  }

  print(sple){
    this.device.push("printInit","",msg =>{
      console.log("push success");
      this.device.push("print",sple.TwoSampleId,msg =>{
        console.log("push success");
      },err => {
        this.toast(err);
        console.log("push failed");
      });
    },err => {
      this.toast(err);
      console.log("push failed");
    });
  }

  ionViewDidLeave(){
    if (this.navParams.data.callback!=null) {
      this.navParams.data.callback();
    }
  }
}
