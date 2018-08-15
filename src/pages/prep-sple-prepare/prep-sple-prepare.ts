import { DeviceIntefaceServiceProvider } from './../../providers/device-inteface-service/device-inteface-service';
import { prepSubSample } from './../prep-sple-element/prep-sple-element';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the PrepSplePreparePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prep-sple-prepare',
  templateUrl: 'prep-sple-prepare.html',
})
export class PrepSplePreparePage extends BasePage {
  spleId: string;
  size: number = 2;
  require: string = "样品制备过程要尽可能使每一份样品都是均匀地来自该样品总量.";
  sple: any = {};
  elements: any;
  subSamples: any = [];
  num:number;
  SampleCategorys = {
    "1": "表层土壤",
    "2": "深层土壤",
    "3": "水稻",
    "4": "小麦",
    "5": "蔬菜及其他农产品",
    "6": "其他"
  };

  constructor(
    private net: TyNetworkServiceProvider,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private ref: ChangeDetectorRef, 
    public device:DeviceIntefaceServiceProvider) {
    super(navCtrl, navParams, toastCtrl);
    this.spleId = navParams.data.spleId;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepSplePreparePage');
    this.getSpleDetail();
  }

  getSpleDetail() {
    this.net.httpPost(AppGlobal.API.prepSpleMake, {
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      'sampleCode': this.spleId
    }, msg => {
      this.sple = JSON.parse(msg);
      if(this.subSamples.length < 3){
        this.normSplit();
      }
      this.ref.detectChanges();
    }, err => {
      this.toast(err);
      this.navCtrl.pop();
    }, true);
  }

  done() {
    this.net.httpPost(AppGlobal.API.progressList,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "TaskID": this.sple.TaskID,
      "SubSamples": this.subSamples
    },msg=>{
      this.toast("提交成功！");
      this.navCtrl.pop();
    },err=>{
      this.toast(err);
    },true);
  }

  splitSple() {
    this.net.httpPost(AppGlobal.API.prepSampleParams, {}, msg => {
      msg = JSON.parse(msg);
      if (msg.ret == 200) {
        this.elements = msg.param;
        for (let element of this.elements) {
          let params: any = [];
          for (let param of element.ParamList) {
            let paramJson: any = {};
            paramJson.name = param;
            paramJson.flag = false;
            params.push(paramJson);
          }
          element.ParamList = params;
        }
        console.log(this.elements);
        this.navCtrl.push("PrepSpleElementPage", { sple: this.sple, elements: this.elements, subSamples: this.subSamples });
      } else {
        this.toast("获取数据异常！");
      }
    }, err => {
      this.toast(err);
      this.navCtrl.pop();
    });
  }

  spleCoding(subSampleId) {
    this.device.push("printInit","hello print!",msg =>{
      console.log("连接成功，正在打印...");
      this.device.push("print", "子样:" + subSampleId ,msg =>{
        console.log("打印成功");
      },err => {
        this.toast(err);
        console.log("push failed");
        console.log(err);
      });
    },err => {
      this.toast(err);
      console.log("push failed");
      console.log(err);
    });
  }
  normSplit() {
    for (let i = 1; i < 4; i++) {
      let paramName: string;
      let SubSampleType:number;
      switch (i) {
        case 1:
          paramName = "国家级入库子样";
          SubSampleType = 3;
          break;
        case 2:
          paramName = "省级入库子样";
          SubSampleType = 4;
          break;
        case 3:
          paramName = "留存样";
          SubSampleType = 5;
          break;
      }
      let SubSampleData:prepSubSample = {
        SubSampleId: this.spleId + "0" + i,
        SubSampleType: SubSampleType+ "",
        ProjectType: 2,
        Weight: 250,
        ParamCatetoryIDs: paramName,
        ParamCatetoryNames: paramName,
        QualityType: 4,
        RelationSampleId: this.spleId + "0" + i,
        holeSize: 2
      }
      this.subSamples.push(SubSampleData);
    }
  }
}