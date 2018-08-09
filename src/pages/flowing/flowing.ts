import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the FlowingPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flowing',
  templateUrl: 'flowing.html'
})
export class FlowingPage {

  flowProgressRoot = 'FlowProgressPage'
  flowAcceptRoot = 'FlowAcceptPage'
  flowPackManagerRoot = 'FlowPackManagerPage'
  flowFlowingRoot = 'FlowFlowingPage'
  flowMoreRoot = 'FlowMorePage'


  constructor(public navCtrl: NavController) {}

}
