import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the AppServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

//全局信息
@Injectable()
export class AppGlobal {

    static cache: any = {
        slides: "_dress_slides",
        categories: "_dress_categories",
        products: "_dress_products"
    }


    static domain = "http://139.196.177.173:8093"; //测试环境
    // static domain = "http://10.8.3.51:9090"; //

    static API = {
        test:"",
        login:'/api/Account/Login',//登录
        smsCode:'/api/v1/account/smsCode',//短信验证码
        register: '/api/v1/account/register', //注册
        resetPassword: '/api/v1/account/resetPwd', //忘记密码
        modifyPassword: '/api/v1/account/modifyPwd', //修改密码
        notifyDownloadSuccess: '/api/StatusUpdate/Post', //编辑用户信息
        taskSummary: '/api/TaskCount/Post', //获取用户信息
        taskList: '/api/TaskList/PostTaskList', //获取任务列表列表
        sampleRecordList:'/api/SampleRecordList/Post',
        sampleDetails:"/api/v1/sampleDetails",
        uploadSamples: '/api/Update/Post', //上传采集数据
        uploadImage:'/api/v1/user/uploadImage',
        sampleFlow:'/api/SampleFlow/Post',
        updateFlow:'/api/FlowStatusUpdate/Post',
        flowedList:'/api/FlowedList/Post',
        progressList:'/api/ProgressList/Post',
        prepSpleDetail:'/api/ProgressSample/Post',
        prepSpleAccSearch:'/api/AcceptSampleSearch/Post',
        prepSpleAcc:'/api/AcceptSample/Post',
    };
    static DATA:any ={
      uploadDoc:':8080/pc/data/uploadDoc',//文件上传
    }
    static RETURNCODE:any ={
        succeed:200//成功
    }

}

@Injectable()
export class AppServiceProvider {
  private static instance:AppServiceProvider = new AppServiceProvider();
  //当前用户信息
  public userinfo:any = {
    username:"",
    token:"",
    userid:"",
    appType:""
  };
  //带下载任务列表,已撤回和新任务的并集
  public undownTaskList:any[] = [];
//带下载任务列表
  public newTaskList:any[] = [];
  //已下载任务列表
  public downloadedTaskList:any[] = [];

  //已上传任务列表
  public uploadedTaskList:any[] = [];

  //已撤回任务列表
  public returnedTaskList:any[] = [];

  public spleTeam:string = "";
  public teamMember:string = "";

  constructor() {
    if (AppServiceProvider.instance) {
      throw new Error("错误: 请使用AppServiceProvider.getInstance() 代替使用new.");
    }
    AppServiceProvider.instance = this;
  }
    /**
     * 获取应用单例
     * 
     * @static
     * @returns {AppServiceProvider}
     */
    public static getInstance(): AppServiceProvider {
      return AppServiceProvider.instance;
  }

}
