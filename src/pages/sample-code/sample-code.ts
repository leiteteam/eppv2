import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SampleCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sample-code',
  templateUrl: 'sample-code.html',
})
export class SampleCodePage {
  taskData:any;
  subSamples:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.taskData = navParams.get("taskData");
    this.subSamples = navParams.get("subSamples");
  }

  goSampleSplit(){
    this.navCtrl.push("SampleSplitPage", {category: this.taskData["category"]});
  }

}
