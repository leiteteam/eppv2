import { ModalController } from 'ionic-angular';
import { DeviceIntefaceServiceProvider } from './../device-inteface-service/device-inteface-service';
import { DbServiceProvider } from './../db-service/db-service';
import { Injectable } from '@angular/core';

/*
  Generated class for the PrintServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrintServiceProvider {

  constructor(public modalCtrl: ModalController,
    public db:DbServiceProvider,
    public device:DeviceIntefaceServiceProvider) {
    
  }

  print(printTitle:string, printCode:string){
    let msg: any = {};
    msg.printTitle = printTitle;
    msg.printCode = printCode;
    this.db.getString("bluetoothAddress", res => {
      if(res == null || res == ""){
        this.modalCtrl.create("BluetoothSearchPage",{msg: msg}).present();
      } else {
        msg.address = JSON.parse(res).address;
        console.log(JSON.stringify(msg));
        this.device.push("print", JSON.stringify(msg), success => {
          console.log("打印成功");
        }, error => {
          this.modalCtrl.create("BluetoothSearchPage").present();
        });
      }
    }, err => {
      this.modalCtrl.create("BluetoothSearchPage").present();
    });
    
  }

}
