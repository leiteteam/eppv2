import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the PrepMorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prep-more',
  templateUrl: 'prep-more.html',
})
export class PrepMorePage extends BasePage{

  unit:any = {};
  printState:string = "未连接";

  constructor(
    public events:Events,
    public alert:AlertController,
    public loadingCtrl:LoadingController,
    public device:DeviceIntefaceServiceProvider,
    public net:TyNetworkServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepMorePage');
    this.initState();
    this.queryUnit();
  }

  initState(){
    this.device.push("printState","",(state)=>{
      this.printState = state;
    });
  }

  queryUnit(){
    this.net.httpPost(
      AppGlobal.API.unitInfo,
      {
        "username": AppServiceProvider.getInstance().userinfo.username
      },
      msg => {
        console.log(msg);
        let ret = JSON.parse(msg);
        this.unit = ret.unitInfo;
      },
      error => {
        this.toast(error);
      },
      true);
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

  printAssist(){

  }

}
