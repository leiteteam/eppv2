import { AppServiceProvider } from './../../providers/app-service/app-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { DbServiceProvider } from '../../providers/db-service/db-service';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage extends BasePage {
  bgImg = "assets/imgs/halo.jpg";
  newsList:any = [
    {
			"imageUrl":"assets/imgs/blur_bg.jpg","url":"","title":""
		}
  ];
  appList:any = [
    {
			name:"样品采集",icon:"leaf",appType:"Cy"
    },
    {
			name:"样品制备",icon:"color-fill",appType:"Zy"
    },
    {
			name:"样品流转",icon:"md-car",appType:"Lz"
    },
    {
			name:"样品测试",icon:"flask",appType:"Cs"
		}
  ];

  constructor(
    public device:DeviceIntefaceServiceProvider,
    public mtoast: ToastController, 
    public navCtrl: NavController, 
    private db: DbServiceProvider,
    public navParams: NavParams) {
    super(navCtrl, navParams, mtoast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  gotoLogin(appType:string){
    AppServiceProvider.getInstance().userinfo.appType = appType;
    this.db.saveString(appType,"appType");
    this.navCtrl.setRoot("LoginPage");
  }

  testprint(){
    this.device.push("printInit","hello print!",msg =>{
      console.log("push success");
      this.device.push("print","hello print!",msg =>{
        console.log("push success");
      },err => {
        this.toast(err);
        console.log("push failed");
      });
    },err => {
      this.toast(err);
      console.log("push failed");
    });
  }
}
