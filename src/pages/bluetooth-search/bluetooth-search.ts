import { PrintServiceProvider } from './../../providers/print-service/print-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';
import { DeviceIntefaceServiceProvider } from './../../providers/device-inteface-service/device-inteface-service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the BluetoothSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bluetooth-search',
  templateUrl: 'bluetooth-search.html',
})
export class BluetoothSearchPage {
  finish: any;
  stopTime: any;
  devices: any = [];
  msg:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private ref: ChangeDetectorRef, 
    public viewCtrl: ViewController,
    public print: PrintServiceProvider, 
    public db:DbServiceProvider,
    public device:DeviceIntefaceServiceProvider) {
      this.msg = navParams.data.msg;
  }
  ionViewDidLoad(){
    
  }
  ionViewDidEnter() {
    this.search();
  }
  ionViewDidLeave(){
    clearInterval(this.finish);
    this.device.push("stopSearch");
  }
  doRefresh(refresher){
    clearInterval(this.finish);
    this.search();
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }
  getData(){
    console.log(JSON.stringify(this.devices));
  }
  search(){
    clearTimeout(this.stopTime)
    this.device.push("printInit","", success => {
      this.finish = setInterval((device) => {
        device.push("getSearch", "", res => {
          console.log("ionic---info---:"+JSON.stringify(res));
            this.devices = res;
            this.ref.markForCheck();
        }, e => {
          console.log("ionic---err---:"+JSON.stringify(e));
        });
      }, 500, this.device);
    }, error => {
      //this.finish = window.setInterval(this.getSearch, 500);
    }, true);
    this.stopTime = setTimeout(() => {
      clearInterval(this.finish);
    }, 30000);
  }
  deviceClick(device){
    this.db.saveString(JSON.stringify(device),"bluetoothAddress");
    if(this.msg){
      this.print.print(this.msg.printTitle, this.msg.printCode);
    }
    this.viewCtrl.dismiss();
  }
  fresh(){
    clearInterval(this.finish);
    this.search();
  }
  close(){
    this.viewCtrl.dismiss();
  }
}
