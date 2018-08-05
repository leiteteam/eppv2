import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the PreparationPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preparation',
  templateUrl: 'preparation.html'
})
export class PreparationPage {

  prepProgressRoot = 'PrepProgressPage'
  prepSpleAcceptRoot = 'PrepSpleAcceptPage'
  prepPrpareRoot = 'PrepPrparePage'
  prepFlowRoot = 'PrepFlowPage'
  prepMoreRoot = 'PrepMorePage'


  constructor(public navCtrl: NavController) {}

}
