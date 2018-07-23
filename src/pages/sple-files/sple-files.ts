import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';

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
  files: Array<any> = [{title:"武汉江夏区样点1",type:"普通样",count:3},
  {title:"武汉江夏区样点2",type:"普通样",count:13},
  {title:"武汉江夏区样点3",type:"普通样",count:4}];
  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController) {
    super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpleFilesPage');
  }

  keydown(event) {
    if(event.keyCode==13){
      //返回确定按钮
      event.target.blur();
      //this.sendQueryStockInoutRequest(1,null);
      return false;
    }
  }

  search() {
    //this.sendQueryStockInoutRequest(1,null);
  }

  //net 网络请求
  doRefresh(refresher) {
    //刷新
    console.log("下拉刷新");
    //this.sendQueryStockInoutRequest(1, refresher);
    if (refresher != null) {
      refresher.complete();
    }
  }
  doInfinite(refresher) {
    console.log("上拉加载更多");
    //this.sendQueryStockInoutRequest(this.currentPage+1, refresher);
  }
}
