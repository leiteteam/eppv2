import { BasePage } from './../base/base';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the SampleSplitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sample-split',
  templateUrl: 'sample-split.html',
})
export class SampleSplitPage extends BasePage {
  categorys:any;
  subSamples:any;
  taskData:any;
  callback:any;
  num:number;
  subId:any;
  CommonValue:String;
  ParamCatetoryIDs:any = [];
  ParamNames:any = [];
  flags:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController,
    public alertCtrl:AlertController) {
    super(navCtrl,navParams,toastCtrl);
    this.subSamples = navParams.data.subSamples;
    this.taskData = navParams.data.taskData;
    this.categorys = this.taskData.category;
    this.callback = navParams.data.callback;
    this.num = navParams.data.num;
    if( this.subSamples != null ){
      for( let i in this.subSamples ){
        let id = this.subSamples[i].SubSampleId;
        if( this.subId == null || this.subId == ''){
          this.subId = id.substring(0, id.length - 1);
          this.CommonValue = this.subSamples[i].CommonValue;
        }
        id = parseInt(id.substring(id.length - 2));
        id ++;
        if(id > this.num){
          this.num = id;
        }
        let strs = (this.subSamples[i].ParamCatetoryIDs).split(",");
        for(let x in strs){
          this.flags.push(strs[x]);
        }
      }
    }
    for(let index in this.categorys){
      this.categorys[index]['text'] = this.categorys[index]["ParamList"].join("、");
      this.categorys[index]['isCheck'] = false;
      this.categorys[index]['isFlag'] = false;
      for(let x in this.flags){
        if(this.categorys[index].CategoryID == this.flags[x]){
          this.categorys[index]['isFlag'] = true;
        }
      }
    }
  }
  checkedBtn(category){
    category.isCheck = !category.isCheck;
  }
  splitBtn(){
    let flag = true;
    for(let index in this.categorys){
      if(this.categorys[index].isCheck){
        flag = false;
      }
    }
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
    let alert = this.alertCtrl.create({
      title: '该样品重量',
      subTitle: '(单位：g)',
      inputs: [
        {
          name: 'weight',
          type: 'number',
          checked: true,
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        },
        {
          text: '确定',
          cssClass:"primary",
          handler: data => {
              this.splitTask(data.weight)
          }
        }
      ]
    });
    alert.present();
  }
  successBtn(){
    this.callback(this.subSamples, this.num).then(() => { this.navCtrl.pop() });
  }
  splitTask(weight){
    if(weight == ""){
      this.toast("请输入重量！");
      return;
    }
    this.ParamCatetoryIDs = [];
    this.ParamNames = [];
    for(let index in this.categorys){
      if(this.categorys[index].isCheck){
        this.ParamCatetoryIDs.push(this.categorys[index].CategoryID);
        this.ParamNames.push(this.categorys[index].CategoryName);
        this.categorys[index].isFlag = true;
        this.categorys[index].isCheck = false;
      }
    }
    if(this.ParamCatetoryIDs.length <= 0){
      this.toast("请选择分样元素！");
      return;
    }
    if( this.subId == null || this.subId == '' ){
      let date = new Date();
      let str = "" + date.getFullYear() + ((date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1));
      str += this.randomNum(4) + this.randomNum(6) + this.randomNum(2);
      this.subId = str;
      this.CommonValue = str + this.num;
    }
    
    let sub = new SubSample( this.subId + this.num++, 1, weight, 4, this.CommonValue, this.ParamCatetoryIDs.join(","), this.ParamNames.join(","));
    this.subSamples.push(sub.toJson());
    if( this.taskData.QualityType == 2 || this.taskData.QualityType == 3 ){
      sub = new SubSample( this.subId + this.num++ , 1, weight, 5, this.CommonValue, this.ParamCatetoryIDs.join(","), this.ParamNames.join(","));
      this.subSamples.push(sub.toJson());
      sub = new SubSample( this.subId + this.num++ , 1, weight, 5, this.CommonValue, this.ParamCatetoryIDs.join(","), this.ParamNames.join(","));
      this.subSamples.push(sub.toJson());
    }
  }
  randomNum(num){
    let str = "";
    for(let i = 0; i < num; i++) { 
      str += Math.floor(Math.random()*10); 
    }
    return str;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SampleSplitPage');
  }


}
export class SubSample {
  SubSampleId?:String;
  SubSampleType?:number;
  TwoSampleId?:String;
  LaboratorySampleId?:String;
  ProjectType?:number;
  Weight?:number;
  ParamCatetoryIDs?:String;
  ParamNames?:String;
  QualityType:number;
  RelationSampleId:String;
  constructor(SubSampleId,ProjectType,Weight,QualityType,RelationSampleId,ParamCatetoryIDs,ParamNames,SubSampleType?){
    this.SubSampleId = SubSampleId;
    this.SubSampleType = SubSampleType;
    this.ProjectType = ProjectType;
    this.Weight = Weight;
    this.ParamCatetoryIDs = ParamCatetoryIDs;
    this.ParamNames = ParamNames;
    this.QualityType = QualityType;
    this.RelationSampleId = RelationSampleId;
  }
  toJson(){
    return {SubSampleId: this.SubSampleId, SubSampleType: this.SubSampleType, TwoSampleId: this.TwoSampleId, LaboratorySampleId: this.LaboratorySampleId,
      ProjectType: this.ProjectType, Weight: this.Weight, ParamCatetoryIDs: this.ParamCatetoryIDs, ParamNames: this.ParamNames,
      QualityType: this.QualityType, RelationSampleId: this.RelationSampleId};
  }
}
