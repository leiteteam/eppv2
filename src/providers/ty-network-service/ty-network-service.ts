import { AppServiceProvider, AppGlobal } from './../app-service/app-service';
import { Injectable, NgZone } from '@angular/core';
import { LoadingController, Events } from 'ionic-angular';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
declare var cordova;
/*
  Generated class for the TyNetworkServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TyNetworkServiceProvider {

  constructor(
    public loadingCtrl: LoadingController,
    public zone?:NgZone,
    public http?:HttpClient,
    public events?: Events) {

  }
  encode(params) {
    var str = '';
    if (params) {
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var value = params[key];
                str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
            }
        }
        str = '?' + str.substring(0, str.length - 1);
    }
    return str;
  }
  userLogin(url, params, success,failed, loader: boolean = false){
    let loading = this.loadingCtrl.create();
    if (loader) {
        loading.present();
    }
    cordova.plugins.TYNative.userLogin(params,msg => {
      //成功
      this.zone.runGuarded(()=>{
        if (loader) {
          loading.dismiss();
        }
        success(msg);
      });
      
    },(msg) => {
      //失败
      this.zone.runGuarded(()=>{
        if (loader) {
          loading.dismiss();
        }
        failed(msg);
      });
     
    });
    
  }
  httpPost(api, params, success,failed, loader: boolean = false) {

    //兼容部分接口模拟数据//
    // if("common|queryNews" == params.ACTION_NAME){
    //   this.webGet(url, params, success,failed, loader);
    //   return;
    // }
    
    console.log("post:"+api+"-->"+JSON.stringify(params));
    let loading = this.loadingCtrl.create();

    if (loader) {
        loading.present();
    }
    let mParams = {
    };
    if(AppServiceProvider.getInstance().userinfo!=null){
      mParams = {
        "postData":JSON.stringify(params),
        "url":(AppGlobal.domain+api+"")
      };
    }else{
      mParams = {
        "postData":JSON.stringify(params),
        "url":(AppGlobal.domain+api+"")
      };
    }
    cordova.plugins.TYNative.post(mParams,msg=>{
      this.zone.runGuarded(()=>{
        if (loader) {
          loading.dismiss();
        }
        success(msg);
      });
    },error=>{
      this.zone.runGuarded(()=>{
        if (loader) {
          loading.dismiss();
        }
        if ("tokenError150" == error){
          this.events.publish("tokenError150");
        }
        else {
          failed(error);
        }
      });
    });
  }
  httpGet(url, params, success,failed, loader: boolean = false) {
    let loading = this.loadingCtrl.create();
    if (loader) {
        loading.present();
    }
    let mParams = {
      "requestActionName":params.ACTION_NAME,
      "sessionID":AppServiceProvider.getInstance().userinfo.SESSIONID,
      "userID":AppServiceProvider.getInstance().userinfo.USERID,
      "actionInfoStr":JSON.stringify(params),
      "url":(AppGlobal.domain+url+"")
    };
    cordova.plugins.TYNative.get(mParams,msg=>{
    
      this.zone.runGuarded(()=>{
        if (loader) {
          loading.dismiss();
        }
        success(msg);
      });
    },error=>{
      this.zone.runGuarded(()=>{
        if (loader) {
          loading.dismiss();
        }
        failed(error);
      });
    });
  }


  ///////////////////////////////////////////////带进度的多条数据上传////////////////////////////////////////////////////////
  isFirst:boolean = true;
  count:number = 0;
  uploadRecords(arr, success, failed, progress, complete) {    
    if (this.isFirst) {
      this.count = arr.length;
      this.isFirst = false;
    }

    let record = arr.pop();
    let spleList:any[] = [];
    spleList.push(record);
    this.uploadRecordPost(spleList, (response) => {
      success(record, response);
      if (arr.length > 0) {
        //继续发送
        this.uploadRecords(arr, success, failed, progress, complete);
      } else {
        //发送完成
        this.isFirst = true;
        complete();
      }
    }, error => {
      this.isFirst = true;
      failed(error);
    }, uploadProgress => {
      let myProgress = uploadProgress;
      if (this.count > 1) {
        let subProgress = uploadProgress / this.count;
        myProgress = 100 * (this.count - arr.length - 1) / this.count + subProgress;
      }
      myProgress = parseInt(0 + myProgress);
      progress(myProgress);
    });
  }

  uploadRecordPost(record, success, failed, progress?) {
    console.log("post:" + AppGlobal.domain +  AppGlobal.API.uploadSamples + "-->" + JSON.stringify(record));
    this.http.request(new HttpRequest(
      'POST',
      AppGlobal.domain +  AppGlobal.API.uploadSamples,
      {
        "username": AppServiceProvider.getInstance().userinfo.username,
        "token": AppServiceProvider.getInstance().userinfo.token,
        "samples":record
      },
      {
        reportProgress: true
      })).subscribe(event => {

        if (event.type === HttpEventType.DownloadProgress) {
          // {
          // loaded:11, // Number of bytes uploaded or downloaded.
          // total :11 // Total number of bytes to upload or download
          // }
          console.log('loaded:' + event.loaded + '  total:' + event.total);
        }

        if (event.type === HttpEventType.UploadProgress) {
          // {
          // loaded:11, // Number of bytes uploaded or downloaded.
          // total :11 // Total number of bytes to upload or download
          // }
          console.log('loaded:' + event.loaded + '  total:' + event.total);
          if (event.total && progress) {
            let uploadProgress = event.loaded / event.total;
            console.log('progress:' + uploadProgress);
            uploadProgress = parseInt('0' + uploadProgress * 100);
            progress(uploadProgress);
          }
        }

        if (event.type === HttpEventType.Response) {
          console.log(event.body);

          let res = event.body
          //成功
          this.zone.runGuarded(() => {

            if (success != null) {
              console.log("result:" + JSON.stringify(res));
              let re = res as any;
              let code = re.ret;
              if (200 == code) {
                success(re);
              } 
              else if(code == 150){
                this.events.publish("tokenError150");
                //failed(des);
              }
              else{
                if (failed != null) {
                  failed(re.desc);
                }
              }
            }
          });
        }
      }, error => {
        this.zone.runGuarded(() => {
          if ("tokenError150" == error){
            this.events.publish("tokenError150");
          }
          else {
            if (failed != null) {
              failed(error);
            }
          }
          
        });
      })

  }
}
