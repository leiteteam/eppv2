import { Component } from '@angular/core';
import { NavController, NavParams } from '../../../node_modules/ionic-angular/umd';

/**
 * Generated class for the PrepSpleDetail page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-prep-sple-detail',
  templateUrl: 'prep-sple-detail.html',
})
export class PrepSpleDetail {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrepSpleDetail');
  }

}
