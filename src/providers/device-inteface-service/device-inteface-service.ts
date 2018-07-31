import { AppGlobal } from './../app-service/app-service';
import { Platform, LoadingController } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
declare var cordova;

/*
  Generated class for the DeviceIntefaceServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeviceIntefaceServiceProvider {

  constructor(public loadingCtrl: LoadingController,private platfrom:Platform,public zone:NgZone){
    console.log('Hello DeviceIntefaceServiceProvider Provider');
  }
  
  push(command,commandData?, success?,failed?,showLoading?){
    if(this.platfrom.is("mobileweb")||this.platfrom.is("mobile")==false){
      if(failed){
        failed("平台暂不支持");
      }
    }else{
    let loading = this.loadingCtrl.create();
    if (showLoading) {
        loading.present();
    }
      let param= {"command":command,"commandData":commandData}
      cordova.plugins.TYNative.push(param,msg=>{
        this.zone.runGuarded(()=>{
          if (showLoading) {
            loading.dismiss();
          }
          if(success){
            success(msg);
          }
        });
        
      },error=>{
        this.zone.runGuarded(()=>{
          if (showLoading) {
            loading.dismiss();
          }
          if(failed){
            failed(error);
          }
        });
       
      });
    }
  }
  uploadfileWithBase64String(base64String,fileType:String = ".jpeg",success?,failed?){
    if(this.platfrom.is("mobileweb")||this.platfrom.is("mobile")==false){
      if(failed){
        failed("平台暂不支持");
      }
    }else{
      let param= {"url":AppGlobal.domain+AppGlobal.API.uploadImage,"base64String":base64String,"fileType":fileType}
      cordova.plugins.TYNative.uploadfileWithBase64String(param,msg=>{
        this.zone.runGuarded(()=>{
          if(success!=null){
            success(msg);
          }
        });
      },error=>{
        this.zone.runGuarded(()=>{
          if(failed!=null){
            // console.log("ggggggggggggggggggggg");
            failed(error);
          }
        });
      
      });
    }
  }

}
