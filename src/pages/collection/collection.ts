import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';

/**
 * Generated class for the CollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage extends BasePage{
  spleCategory: any = "待采样";
  tabList = [{name:"待采样",count:4},{name:"已采样",count:0},{name:"已上传",count:0},{name:"待流转",count:0}];
  spleList: { [category: string]: Array<any> } = {
    "待采样":[{spleNo:"07219388",addr:"武汉市江夏区梁子湖",title:"表层土壤有机物监控点",desc:"甚或影响区，表层"},
              {spleNo:"07219389",addr:"武汉市江夏区梁子湖",title:"表层土壤有机物监控点",desc:"甚或影响区，表层"}
            ],
  };
  recordsTotalList: { [category: string]: number } = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  onCllect(spleTask){
    this.navCtrl.push('CollectProcessPage', {'spleTask':spleTask});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionPage');
  }

  segmentClick(index:number) {
    //alert(this.dictCode[item]);
    this.spleCategory = this.tabList[index].name;
    if (this.spleList[this.spleCategory] == null || this.spleList[this.spleCategory].length == 0) {
      //this.findLoaFindDetailsByPage(null);
    }
  }
}
