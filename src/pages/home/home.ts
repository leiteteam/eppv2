import { AppServiceProvider } from './../../providers/app-service/app-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

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
  newsList:any = [
    {
			"imageUrl":"assets/imgs/blur_bg.jpg","url":"","title":""
		}
  ];

  constructor(
    public device:DeviceIntefaceServiceProvider,
    public mtoast: ToastController, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
    super(navCtrl, navParams, mtoast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

  }

  gotoNewsDetail(news){
    this.device.push("webView",news.url,msg =>{
      console.log("push success");
    },err => {
      this.toast(err);
      console.log("push failed");
    });
  }

  gotoLogin(appType:string){
    AppServiceProvider.getInstance().appType = appType;
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
