import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SpleStationInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sple-station-info',
  templateUrl: 'sple-station-info.html',
})
export class SpleStationInfoPage {

  sple:any;
  isSub:boolean = false;
  
  DepartmentIDs = {
    "1":"环保",
    "2":"国土资源",
    "3":"农业",
    "4":"卫生计生",
    "5":"其他"
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
    this.sple = navParams.data.sple;
    this.isSub = navParams.data.isSub;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpleStationInfoPage');
  }

  back(){
    this.viewCtrl.dismiss();
  }
}
