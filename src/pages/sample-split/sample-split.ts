import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SampleSplitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sample-split',
  templateUrl: 'sample-split.html',
})
export class SampleSplitPage {
  categorys:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.categorys = navParams.get("category");
    for(let index in this.categorys){
      this.categorys[index]['text'] = this.categorys[index]["ParamList"].join("、");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SampleSplitPage');
  }

}
