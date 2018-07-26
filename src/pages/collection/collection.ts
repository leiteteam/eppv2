import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
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
  spleCategory: any = "todo";
  spleType = "main";
  tabList = [{name:"todo",count:4},{name:"done",count:0},{name:"uploaded",count:0},{name:"togo",count:0}];
  spleList: { [category: string]: Array<any> } = {
    "todo":[{spleNo:"07219388",addr:"武汉市江夏区梁子湖",title:"表层土壤有机物监控点",desc:"甚或影响区，表层"},
              {spleNo:"07219389",addr:"武汉市江夏区梁子湖",title:"表层土壤有机物监控点",desc:"甚或影响区，表层"}
            ],
  };

  mainSpleTogoList = [
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    }
  ];

  subSpleTogoList = [
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    },
    {
      spleNo:"roieu84593485938",
      spleStore:{
        name:"国家样中心",
        unit:"军营第二单位",
        addr:"民族大道与三环线交汇处",
        contact:"张杰",
        phone:"15654444333"
      },
      spleType:"地表样",
    }
  ];

  recordsTotalList: { [category: string]: number } = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController,public modalCtrl: ModalController) {
    super(navCtrl,navParams,toastCtrl);
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

  spleDetail(sple){
    const profileModal = this.modalCtrl.create("SpleStationInfoPage", { sple: sple }, { showBackdrop: false }, );
    profileModal.present();
  }
}
