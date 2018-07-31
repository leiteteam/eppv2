import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the TaskServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TaskServiceProvider {

  constructor(public http: Http) {
  }
  getTaskData(){
    return this.http.get("assets/data/task.json");
  }
}
