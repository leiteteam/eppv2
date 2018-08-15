import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the TestTestingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-testing',
  templateUrl: 'test-testing.html',
})
export class TestTestingPage extends BasePage{

  packNo:string = "";
  testList = [];

  constructor(
    public net:TyNetworkServiceProvider,
    public device:DeviceIntefaceServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestTestingPage');
  }

  /**
   * 监听键盘enter键
   * @param event 
   */
  onkey(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.navCtrl.push("TestPackInfoPage",{packNo:this.packNo,callback:this.callback});
      return false;
    }
  }

  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    this.testList = [];
    if (refresher != null) {
      refresher.complete();
    }
  }

  scan(){
    this.device.push("qrCodeScan",'',(packNo)=>{
      console.log("packNo:"+packNo);
      this.navCtrl.push("PrepSplePreparePage",{packNo:packNo,callback:this.callback});
    },(err)=>{
      this.toastShort(err);
    });
  }

  //选择条件回调
  callback = (pack) => {
    this.testList.push(pack);
  }

}
