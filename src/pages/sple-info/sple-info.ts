import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SpleInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sple-info',
  templateUrl: 'sple-info.html',
})
export class SpleInfoPage {
  isSub:boolean = false;
  title:string = "主样品信息";
  info:any = {
    name:"河边土壤",
    spleNo:"4657653245",
    subSpleNo:"456568797897",
    weight:"2000g",
    use:"国家入库字样，省级入库字样,级入库字样",
    storage:"大连图纸见测距",
    addr:"中央路似乎安心",
    contact:"何洁 13544356666",
    limit:"2018-09-12-2018-09-28",
    keep:"常温"
  };

  conditions:any = {
    a1:"样品标签文字和二维码是否清晰、完好",
    a2:"样品重量是否符合要求(测试样1.5kg，质控样2.5kg)",
    a3:"样品数量正确(测试样1份，质控样3份)",
    a4:"样品包装容器类别正确、外观完好",
    a5:"样品保存方式符合要求(常温/低温/避光)"
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpleInfoPage');
  }

}
