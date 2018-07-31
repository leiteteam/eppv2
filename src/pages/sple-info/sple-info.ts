import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the SpleInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sple-info',
  templateUrl: 'sple-info.html',
})
export class SpleInfoPage extends BasePage{
  isSub:boolean = false;
  spleId:string = "";
  spleIdTxt:string = "";
  title:string = "主样品信息";

  info:any = {
    SampleName:"",
    MainSampleId:"",
    SubSampleId:"",
    Weight:0,
    SamplePurpose:"",
    UnitName:"",
    UnitAddress:"",
    Phone:"",
    TimeLimit:"",
    StorageMethod:""
  };

  conditions:any = {
    a1:"样品标签文字和二维码是否清晰、完好",
    a2:"样品重量是否符合要求(测试样1.5kg，质控样2.5kg)",
    a3:"样品数量正确(测试样1份，质控样3份)",
    a4:"样品包装容器类别正确、外观完好",
    a5:"样品保存方式符合要求(常温/低温/避光)"
  };

  labelcheck:boolean = false;
  weightcheck:boolean = false;
  numcheck:boolean = false;
  packcheck:boolean = false;
  storagecheck:boolean = false;

  constructor(public net:TyNetworkServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public device:DeviceIntefaceServiceProvider,
    public toastCtrl:ToastController,) {
      super(navCtrl,navParams,toastCtrl);
      if (navParams.data.spleId){
        this.spleId = navParams.data.spleId;
        if(this.spleId.indexOf('&') != -1){
          this.spleIdTxt = this.spleId.split('&')[0];
          this.isSub = this.spleId.split('&')[1] == 'sub';
          if (this.isSub){
            this.title = "子样品信息";
          }
        }
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpleInfoPage');
    if (this.spleIdTxt){
      this.querySampleInfo();
    }
  }

  querySampleInfo(){
    this.net.httpPost(
      AppGlobal.API.sampleFlow,
      {
        'sampleCode':this.spleId
      },
      msg => {
        console.log(msg);
        let resp = JSON.parse(msg);
        this.info = resp.info;
      },
      error => {
        this.toast(error);
      },
      true);
  }

  comfirm(){
    let sampleCheck:any = {
      labelcheck:this.labelcheck?'1':'0',
      weightcheck:this.weightcheck?'1':'0',
      numcheck:this.numcheck?'1':'0',
      packcheck:this.packcheck?'1':'0',
      storagecheck:this.storagecheck?'1':'0',
    };
    this.net.httpPost(
      AppGlobal.API.updateFlow,
      {
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        'sampleCode':this.info.SubSampleId?this.info.SubSampleId+'&sub' : this.info.MainSampleId+'&main',
        "sampleCheck":JSON.stringify(sampleCheck)
      },
      msg => {
        console.log(msg);
        this.toastShort("流转成功");
        this.back();
      },
      error => {
        this.toast(error);
      },
      true);
  }

  back(){
    this.navCtrl.pop();
  }
}
