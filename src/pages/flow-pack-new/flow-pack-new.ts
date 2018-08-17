import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { BasePage } from '../base/base';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the FlowPackNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flow-pack-new',
  templateUrl: 'flow-pack-new.html',
})
export class FlowPackNewPage extends BasePage{

  packCate = 1;
  packCates: any = [
    {
      name: '',
      options: [
        { text: '普通检测样包', value: 1 },
        { text: '实验室间质控样包', value: 2 },
        // { text: '入库包', value: 3 }
      ]
    }
  ];

  spleCate = 1;
  spleCates: any = [
    {
      name: '',
      options: [
        { text: '表层土壤', value: 1 },
        { text: '深层土壤', value: 2 },
        { text: '农产品', value: 3}
      ]
    }
  ];

  testItem = 1;
  testItems: any = [
    {
      name: '',
      options: [
        { text: '仅多环芳烃', value: 1 },
        { text: '含多环芳烃', value: 2 },
        { text: '无多环芳烃', value: 3 },
        { text: '氰化物', value: 4 },
        { text: '无机包', value: 5 }
      ]
    }
  ];

  lab = '请选择';
  labList:any = [
    {
      name: '',
      options: []
    }
  ];

  constructor(
    public net:TyNetworkServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlowPackManagerPage');
    this.getLabList();
  }

  getLabList(){
    this.net.httpPost(AppGlobal.API.flowLabList,{},(msg)=>{
      let info = JSON.parse(msg);
      info.list.forEach(element => {
        this.labList[0].options.push({
          text:element.LabName,
          value:element.LabId
        });
      });
    },err=>{
      this.toast(err);
    },true);
  }

  done(){
    this.newPack();
  }

  newPack(){
    this.net.httpPost(AppGlobal.API.flowPackNew,{
      "username": AppServiceProvider.getInstance().userinfo.username,
      "token": AppServiceProvider.getInstance().userinfo.token,
      "LabId":this.lab,
      "PackageType":this.packCate,
      "PackageYpType":this.spleCate,
      "CheckParam":this.testItem
    },(msg)=>{
      let info = JSON.parse(msg);
      if (this.navParams.data.callback){
        this.navParams.data.callback(info.packageList);
      }
      this.navCtrl.pop();
    },err=>{
      this.toast(err);
    },true);
  }
}
