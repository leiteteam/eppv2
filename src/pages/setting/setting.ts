
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Events, ToastController } from 'ionic-angular';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { BasePage } from '../base/base';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage extends BasePage{

  wifiState:boolean = false;
  g4State:boolean = false;
  bleState:boolean = false;

  printState:string = "未连接";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alert:AlertController,
    public events:Events,
    public device:DeviceIntefaceServiceProvider,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController) {
      super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    this.initState();
  }

  initState(){
    this.device.push("wifiState","",(state)=>{
      this.wifiState = state==1;
    });
    this.device.push("g4State","",(state)=>{
      this.g4State = state==1;
    });
    this.device.push("bleState","",(state)=>{
      this.bleState = state==1;
    });
    this.device.push("printState","",(state)=>{
      this.printState = state;
    });
  }

  switchWifi(event){
    console.log("switchWifi toggled "+ event.checked);
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
    });
    loading.present();
    this.device.push("switchWifi");
    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  switch4g(event){
    console.log("switch4g toggled "+ event.checked);
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
    });
    loading.present();
    this.device.push("switch4g");
    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  switchBle(event){
    console.log("switchBle toggled "+ event.checked);
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
    });
    loading.present();
    this.device.push("switchBle");
    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  clearCache(){
    let alert = this.alert.create({
      title:'本操作将删除全部已上传的采样数据，请谨慎确认！',
      buttons:[{
        text:'取消'
      },{
        text:'确定',
        handler:()=>{
          console.log('confirm');
          let loading = this.loadingCtrl.create({
            spinner: 'ios',
            content: '正在清除...'
          });
          loading.present();
          
          this.device.push("clearCache","clear",msg =>{
            console.log("push success");
            this.toast("清除缓存成功！");
            loading.dismiss();
          },err => {
            this.toast(err);
            console.log("push failed");
            this.toast(err);
            loading.dismiss();
          });
        }
      }]
    });

    alert.present();
  }

  logout(){
    let alert = this.alert.create({
      title:'您确定退出此登陆账号吗？',
      buttons:[{
        text:'取消'
      },{
        text:'确定',
        handler:()=>{
          this.events.publish('logoutNotification');
        }
      }],
      enableBackdropDismiss:false
    });

    alert.present();
  }

  checkUpdate(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
    });
    loading.present();
    setTimeout(() => {
      this.toast("当前已是最新版本");
      loading.dismiss();
    }, 2000);
  }

  about(){
    this.navCtrl.push("TestDevPage");
  }
}
