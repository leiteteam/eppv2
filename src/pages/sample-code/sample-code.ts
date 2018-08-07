import { BasePage } from './../base/base';
import { DeviceIntefaceServiceProvider } from './../../providers/device-inteface-service/device-inteface-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the SampleCodePage page.
 *
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
  subSamples:any;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public device:DeviceIntefaceServiceProvider, public navParams: NavParams) {
    super(navCtrl, navParams, toastCtrl);
    this.taskData = navParams.get("taskData");
    this.subSamples = navParams.get("subSamples");
  }
  printCodes(){
    this.device.push("printInit","hello print!",msg =>{
      console.log("连接成功，正在打印...");
      for(let i in this.subSamples){
        this.device.push("print", this.subSamples[i].SubSampleId ,msg =>{
          console.log("打印成功");
        },err => {
          this.toast(err);
          console.log("push failed");
        });
      }
    },err => {
      this.toast(err);
      console.log("push failed");
    });
    
    
  }
  printCode(SubSampleId){
    this.device.push("printInit","hello print!",msg =>{
      console.log("连接成功，正在打印...");
      this.device.push("print", SubSampleId ,msg =>{
        console.log("打印成功");
      },err => {
        this.toast(err);
        console.log("push failed");
      });
    },err => {
      this.toast(err);
      console.log("push failed");
    });

  }
  goSampleSplit(){
    this.navCtrl.push("SampleSplitPage", {category: this.taskData["category"]});
  }

}
