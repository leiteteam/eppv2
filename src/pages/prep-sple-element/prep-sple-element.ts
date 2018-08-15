import { prepSubSample } from './prep-sple-element';
import { BasePage } from './../base/base';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DbServiceProvider } from '../../providers/db-service/db-service';

/**
 * Generated class for the PrepSpleElementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prep-sple-element',
  templateUrl: 'prep-sple-element.html',
})
export class PrepSpleElementPage extends BasePage {
  elements:any;
  subSamples:any;
  subSample:prepSubSample;
  sple:any;
  boreDiameter:any = {};
  ParamCatetoryNames:string;
  ParamCatetoryIDs:string;
  num:number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController,
   public alertCtrl:AlertController,public db:DbServiceProvider) {
    super(navCtrl,navParams,toastCtrl);
    this.elements = navParams.data.elements;
    this.subSamples = navParams.data.subSamples;
    this.sple = navParams.data.sple;
    db.getString("boreDiameter", msg => {
      if(msg != null && msg != ''){
        this.boreDiameter = JSON.parse(msg);
      }
    });
    if(this.subSamples.length < 3){
      this.toast("分样出错，请重试！");
      navCtrl.pop();
    }
    for(let subSample of this.subSamples){
      let id = subSample.SubSampleId;
      id = parseInt(id.substring(id.length - 2));
      id++;
      if(id > this.num){
        this.num = id;
      }
    }
    console.log(this.num);
  }
  eleBtn(param){
    param.flag = !param.flag;
  }
  splitBtn(){
    let ele = '';
    let flag = true;
    let paramIds:any = [];
    let paramNames:any = [];
    for(let element of this.elements){
      let params:any = [];
      for(let param of element.ParamList){
        if(param.flag){
          params.push(param.name);
          flag = false;
          if(ele == ''){
            ele = element.CategoryID;
          }
          param.flag = false;
        }
      }
      if(params.length > 0){
        paramIds.push(element.CategoryID);
        paramNames.push(element.CategoryName + params.length + "种:" + params.join("、"));
      }
    }
    this.ParamCatetoryIDs = paramIds.join(",");
    this.ParamCatetoryNames = paramNames.join(",");
    if(flag){
      let alert = this.alertCtrl.create({
        title: '请选择分样元素！',
        buttons: [
          {
            text: '确定',
            cssClass:"primary"
          }
        ]
      });
      alert.present();
      return;
    }
    console.log(this.boreDiameter);
    let alert = this.alertCtrl.create({
      title: '分样参数',
      message:'子样重量(g)、过筛孔径(mm)',
      inputs: [
        {
          name: 'weight',
          type: 'number',
          checked: true,
          placeholder: '子样重量(g)'
        },
        {
          name: 'bore',
          type: 'number',
          checked: true,
          value: this.boreDiameter[ele],
          placeholder: '过筛孔径(mm)'
        }
      ],
      buttons: [
        {
          text: '取消',
          handler: data => { }
        },
        {
          text: '确定',
          cssClass:"primary",
          handler: data => {
             this.splitTask( data.weight, data.bore, ele );
          }
        }
      ]
    });
    alert.present();
  }
  successBtn(){
    this.db.saveString(JSON.stringify(this.boreDiameter), 'boreDiameter');
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepSpleElementPage');
  }

  splitTask(weight, bore, ele){
    if(!weight){
      this.toast("请输入重量！");
      return;
    }
    if(!bore){
      this.toast("请输入过筛孔径！");
      return;
    }
    this.boreDiameter[ele] = bore;
    let CommonValue = "";
    for(let i = 0; i < (this.sple.QualityType == 4 ? 1 : 3); i++){
      let qType = 5;
      if(i == 0){
        qType = 4;
        CommonValue = this.sple.SampleCode + (this.num < 10 ? "0"+ this.num : this.num);
      }
      this.subSample = {
        SubSampleId: this.sple.SampleCode + (this.num < 10 ? "0"+ this.num : this.num),
        SubSampleType: "2",
        ProjectType: 2,
        Weight: parseInt(weight),
        ParamCatetoryIDs: this.ParamCatetoryIDs,
        ParamCatetoryNames: this.ParamCatetoryNames,
        QualityType: qType,
        RelationSampleId: CommonValue,
        holeSize: parseInt(this.boreDiameter[ele])
      }
      this.num++;
      this.subSamples.push(this.subSample);
    }
  }

}
export interface prepSubSample {
  SubSampleId:string;
  SubSampleType?:string;
  ProjectType?:number;
  Weight?:number;
  ParamCatetoryIDs?:string;
  ParamCatetoryNames?:string;
  QualityType?:number;
  RelationSampleId?:string;
  holeSize?:number;
}
