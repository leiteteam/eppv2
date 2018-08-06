import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the PrepSpleAcceptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prep-sple-accept',
  templateUrl: 'prep-sple-accept.html',
})
export class PrepSpleAcceptPage  extends BasePage{

  SampleCategorys = {
    "1":"表层土壤",
    "2":"深层土壤",
    "3":"水稻",
    "4":"小麦",
    "5":"蔬菜及其他农产品",
    "6":"其他"
  };

  acceptList = [
    {SampleNum:3,SampleNumber:"47568939032FGDYEw434",date:"2017-09-12 13:30:00",SampleCategory:"1"},
    {SampleNum:3,SampleNumber:"47568939032FGDYEw434",date:"2017-09-12 13:30:00",SampleCategory:"1"}];

  constructor(
    public device:DeviceIntefaceServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepSpleAcceptPage');
  }

  accept(){
    this.device.push("qrCodeScan",'',(spleNo)=>{
      console.log("spleNo:"+spleNo);
      this.navCtrl.push("PrepSpleInfoPage",{spleId:spleNo,callback:this.callback});
    },(err)=>{
      this.toastShort(err);
    });
  }

  //选择条件回调
  callback = () => {
    //this.smartRefresh();
  }

  goToSpleDetail(sple){

  }
}
