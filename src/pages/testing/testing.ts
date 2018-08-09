import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the TestingPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html'
})
export class TestingPage {

  testProgressRoot = 'TestProgressPage'
  testAcceptRoot = 'TestAcceptPage'
  testTestingRoot = 'TestTestingPage'
  testMoreRoot = 'TestMorePage'


  constructor(public navCtrl: NavController) {}

}
