import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the SpleFilesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sple-files',
  templateUrl: 'sple-files.html',
})
export class SpleFilesPage extends BasePage{
  likeStr:string = "";
  total: number = 3;
  files: Array<any> = [];
  PointCategorys:string[] = ['','表层土壤调查点位','农产品调查点位','深层土壤调查点位','复合调查点位'];

  constructor(
    public net:TyNetworkServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpleFilesPage');
    this.getSpleFileList(null);
  }
  goCollectInfo(file){
    this.navCtrl.push("CollectProcessPage", {spleTask: file, model: 2});
  }
  keydown(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      this.getSpleFileList(null);
      return false;
    }
  }

  search() {
    this.getSpleFileList(null);
  }

  //net 网络请求
  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    this.getSpleFileList(refresher);
  }

  getSpleFileList(refresher){
    this.net.httpPost(
      AppGlobal.API.sampleRecordList,
      {
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        "condition":this.likeStr
      },
      msg => {
        console.log(msg);
        let info = JSON.parse(msg);
        this.files = info.list;
        if (refresher) {
          refresher.complete();
        }
      },
      error => {
        this.toastShort(error);
        if (refresher) {
          refresher.complete();
        }
      },
      true);
  }
}
