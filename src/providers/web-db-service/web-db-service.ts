import { DbServiceProvider } from './../db-service/db-service';
import { Injectable, NgZone } from '@angular/core';

/*
  Generated class for the WebDbServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebDbServiceProvider implements  DbServiceProvider{

  constructor(public zone:NgZone) {
 
  }
  saveString(str,key,success?,filed?){
    window.localStorage.setItem(key, str);
      if(success){
        success();
      }
  }
  getString(key,success,filed?){
    var value = window.localStorage.getItem(key);
    if (!value) {
      success('');
    } else {
      success(value);
    }
  }

}
