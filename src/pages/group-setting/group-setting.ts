import { BasePage } from './../base/base';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
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
export class GroupSettingPage extends BasePage {

  groupName:string = "";

  organicSplTool:String = '铁铲';

  organicSplContainer:String = '布袋';

  abioSplTool:String = '铁铲';

  abioSplContainer:String = '布袋';

  constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbServiceProvider, public toastCtrl: ToastController, public alertCtrl:AlertController) {
    super(navCtrl, navParams, toastCtrl);
  }

  toolBtn(num){
    let titleName = "有机样品采样工具";
    if(num == 2){
      titleName = "无机样品采样工具";
    }
    let alert = this.alertCtrl.create();
    alert.setTitle( titleName + "-多选框" );

    alert.addInput({
      type: 'checkbox',
      label: '铁铲',
      value: '铁铲'
    });
    alert.addInput({
      type: 'checkbox',
      label: '土钻',
      value: '土钻'
    });
    alert.addInput({
      type: 'checkbox',
      label: '木铲',
      value: '木铲'
    });
    alert.addInput({
      type: 'checkbox',
      label: '竹片',
      value: '竹片'
    });
    alert.addInput({
      type: 'checkbox',
      label: '其他',
      value: '其他'
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        if(data.length <= 0){
          this.toast("未选择工具");
          return;
        }
        let datas: String = data.join(",");
        switch(num){
          case 1:
            this.organicSplTool = datas;
            break;
          case 2:
            this.abioSplTool = datas;
            break;
        }
        
      }
    });
    alert.present();
  }
  containerBtn(num){
    let titleName = "有机样品采样容器";
    if(num == 2){
      titleName = "无机样品采样容器";
    }
    let alert = this.alertCtrl.create();
    alert.setTitle( titleName + "-多选框" );

    alert.addInput({
      type: 'checkbox',
      label: '布袋',
      value: '布袋'
    });
    alert.addInput({
      type: 'checkbox',
      label: '聚乙烯袋',
      value: '聚乙烯袋'
    });
    alert.addInput({
      type: 'checkbox',
      label: '棕色磨口瓶',
      value: '棕色磨口瓶'
    });
    alert.addInput({
      type: 'checkbox',
      label: '其他',
      value: '其他'
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        if(data.length <= 0){
          this.toast("未选择容器");
          return;
        }
        let datas: String = data.join(",");
        switch(num){
          case 1:
            this.organicSplContainer = datas;
            break;
          case 2:
            this.abioSplContainer = datas;
            break;
        }
      }
    });
    alert.present();
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
