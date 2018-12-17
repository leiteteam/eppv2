import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SampleInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sample-info',
  templateUrl: 'sample-info.html',
})
export class SampleInfoPage {
  taskData:any;
  type: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.taskData = navParams.get("taskData");
    this.type = navParams.data.type;
  }

  ionViewDidLoad() {
    //当页面进入初始化的时候
    let elements = document.querySelectorAll(".tabbar");
    if(elements != null) {
        Object.keys(elements).map((key) => {
            elements[key].style.display ='none';
        });
    }
  }

    //当退出页面的时候
  ionViewWillLeave() {
    let elements = document.querySelectorAll(".tabbar");
    if(elements != null) {
        Object.keys(elements).map((key) => {
            elements[key].style.display ='flex';
        });
    }
  }

}
