import { AppServiceProvider } from './../../providers/app-service/app-service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal } from '../../providers/app-service/app-service';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { MenuToggle } from 'ionic-angular/components/menu/menu-toggle';

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
			"imageUrl":"../assets/imgs/blur_bg.jpg","url":"","title":""
		}
  ];

  constructor(
    public device:DeviceIntefaceServiceProvider,
    public mtoast: ToastController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private net: TyNetworkServiceProvider) {
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

  gotoCollectHome(){
    this.navCtrl.push("CollectTabPage");
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
