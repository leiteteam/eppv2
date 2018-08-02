import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { DbServiceProvider } from '../../providers/db-service/db-service';

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

  groupName:string = "";

  organicSplTool = '1';
  organicSplTools: any = [
    {
      name: '',
      options: [
        { text: '铁铲', value: '1' },
        { text: '土钻', value: '2' },
        { text: '木铲', value: '3' },
        { text: '竹片', value: '4' },
        { text: '其他', value: '10' }
      ]
    }
  ];

  organicSplContainer = '1';
  organicSplContainers: any = [
    {
      name: '',
      options: [
        { text: '布袋', value: '1' },
        { text: '聚乙烯袋', value: '2' },
        { text: '棕色磨口瓶', value: '3' },
        { text: '其他', value: '10' }
      ]
    }
  ];

  abioSplTool = '1';
  abioSplTools: any = [
    {
      name: '',
      options: [
        { text: '铁铲', value: '1' },
        { text: '土钻', value: '2' },
        { text: '木铲', value: '3' },
        { text: '竹片', value: '4' },
        { text: '其他', value: '10' }
      ]
    }
  ];

  abioSplContainer = '1';
  abioSplContainers: any = [
    {
      name: '',
      options: [
        { text: '布袋', value: '1' },
        { text: '聚乙烯袋', value: '2' },
        { text: '棕色磨口瓶', value: '3' },
        { text: '其他', value: '10' }
      ]
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupSettingPage');
    this.groupName = AppServiceProvider.getInstance().spleTeam;
    this.db.getString("organicSplTool",organicSplTool=>{
      if (organicSplTool) {
        this.organicSplTool = organicSplTool
      }
    });

    this.db.getString("organicSplContainer",organicSplContainer=>{
      if (organicSplContainer) {
        this.organicSplContainer = organicSplContainer
      }
    });

    this.db.getString("abioSplTool",abioSplTool=>{
      if (abioSplTool) {
        this.abioSplTool = abioSplTool
      }
    });

    this.db.getString("abioSplContainer",abioSplContainer=>{
      if (abioSplContainer) {
        this.abioSplContainer = abioSplContainer
      }
    });
  }

  ionViewDidLeave(){
    this.db.saveString(this.organicSplTool,"organicSplTool");
    this.db.saveString(this.organicSplContainer,"organicSplContainer");
    this.db.saveString(this.abioSplTool,"abioSplTool");
    this.db.saveString(this.abioSplContainer,"abioSplContainer");
  }
}
