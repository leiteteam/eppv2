import { BasePage } from './../base/base';
import { DeviceIntefaceServiceProvider } from './../../providers/device-inteface-service/device-inteface-service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the SampleCodePage page.
 *  https://github.com/getlantern/forum
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sample-code',
  templateUrl: 'sample-code.html',
})
export class SampleCodePage extends BasePage {
  taskData:any;
  sampleData:any;
  subSamples:any;
  num:number = 10;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController,private ref: ChangeDetectorRef, public device:DeviceIntefaceServiceProvider, public navParams: NavParams) {
    super(navCtrl, navParams, toastCtrl);
    this.taskData = navParams.get("taskData");
    this.sampleData = navParams.data.sampleData;
    this.subSamples = this.sampleData['SubSamples'];
    if(this.sampleData.SampleCode == null || this.sampleData.SampleCode == ''){
      let date = new Date();
      let str = "" + date.getFullYear() + ((date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1));
      str += this.randomNum(4) + this.randomNum(6) + this.randomNum(2);
      this.sampleData.SampleCode = str;
    }
  }
  printCodes(){
    this.device.push("printInit","",msg =>{
      console.log("连接成功，正在打印...");
      this.device.push("print", "主样:" + this.sampleData.SampleCode ,msg =>{
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
  printCode(SubSampleId){
    this.device.push("printInit","hello print!",msg =>{
      console.log("连接成功，正在打印...");
      this.device.push("print", "子样:" + SubSampleId ,msg =>{
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
  sampleSplit = (subSamples, num) => {
    return new Promise((resolve, reject) =>{
      this.subSamples = subSamples;
      this.ref.detectChanges();
      this.num = num;
      resolve();
    })
  }
  goSampleSplit(){
    if(this.navParams.data.model == 2){
      this.toast("查看模式，禁止编辑！");
      return;
    }
    if(this.taskData.SampleCategory != 1){
      this.toast("只有表层土壤才能分样！");
      return;
    }
    this.navCtrl.push("SampleSplitPage", {callback: this.sampleSplit, num: this.num, 
      taskData: this.taskData, subSamples: this.subSamples, sampleCode: this.sampleData.SampleCode});
  }
  randomNum(num){
    let str = "";
    for(let i = 0; i < num; i++) { 
      str += Math.floor(Math.random()*10); 
    }
    return str;
  }
}
