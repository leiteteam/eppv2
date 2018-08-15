import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the TestAcceptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-accept',
  templateUrl: 'test-accept.html',
})
export class TestAcceptPage extends BasePage{

  spleNo:string = "";
  acceptList:any = [];

  constructor(
    public device:DeviceIntefaceServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestAcceptPage');
  }

  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    this.acceptList = [];
    if (refresher != null) {
      refresher.complete();
    }
  }

  /**
   * 监听键盘enter键
   * @param event 
   */
  onkey(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.navCtrl.push("TestSpleCheckPage",{spleId:this.spleNo,callback:this.callback});
      return false;
    }
  }

  accept(){
    this.device.push("qrCodeScan",'',(spleNo)=>{
      console.log("spleNo:"+spleNo);
      this.spleNo = spleNo;
      this.navCtrl.push("TestSpleCheckPage",{spleId:spleNo,callback:this.callback});
    },(err)=>{
      this.toastShort(err);
    });
  }

  //选择条件回调
  callback = (sple) => {
    console.log("callback success-->add sple");
    this.acceptList.push(sple);
  }
}
