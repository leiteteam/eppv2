import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GroupSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-setting',
  templateUrl: 'group-setting.html',
})
export class GroupSettingPage {

  groupName:string = "江夏1组";

  organicSplTool = '铁铲';
  organicSplTools: any = [
    {
      name: '',
      options: [
        { text: '铁铲', value: '铁铲' },
        { text: '竹制品', value: '竹制品' },
        { text: '镊子', value: '镊子' }
      ]
    }
  ];

  organicSplContainer = '毛口玻璃瓶';
  organicSplContainers: any = [
    {
      name: '',
      options: [
        { text: '塑料袋', value: '塑料袋' },
        { text: '毛口玻璃瓶', value: '毛口玻璃瓶' },
        { text: '编织袋', value: '编织袋' }
      ]
    }
  ];

  abioSplTool = '铁铲';
  abioSplTools: any = [
    {
      name: '',
      options: [
        { text: '铁铲', value: '铁铲' },
        { text: '竹制品', value: '竹制品' },
        { text: '镊子', value: '镊子' }
      ]
    }
  ];

  abioSplContainer = '塑料袋';
  abioSplContainers: any = [
    {
      name: '',
      options: [
        { text: '塑料袋', value: '塑料袋' },
        { text: '毛口玻璃瓶', value: '毛口玻璃瓶' },
        { text: '编织袋', value: '编织袋' }
      ]
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupSettingPage');
  }

}
