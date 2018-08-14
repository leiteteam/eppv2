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
    this.subSample = {
      SubSampleId: "1111",
      SubSampleType: "2222",
      ProjectType: 4,
      Weight: weight,
      ParamCatetoryIDs: this.ParamCatetoryIDs,
      ParamCatetoryNames: this.ParamCatetoryNames
    }
    console.log(this.subSample);
  }

}
export interface prepSubSample {
  SubSampleId:string;
  SubSampleType?:string;
  ProjectType?:number;
  Weight?:number;
  ParamCatetoryIDs?:string;
  ParamCatetoryNames?:string;
  QualityType?:string;
  RelationSampleId?:string;
  holeSize?:number;
}
