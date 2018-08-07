import { DbServiceProvider } from './../../providers/db-service/db-service';
import { AppGlobal, AppServiceProvider } from './../../providers/app-service/app-service';
import { TyNetworkServiceProvider } from './../../providers/ty-network-service/ty-network-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
// import { Md5 } from 'ts-md5/dist/md5';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BasePage{
  logoUrl: string = "assets/imgs/logo.png";
  username: String;
  password: String;

  info: any = {
    userName: "",
    token: "",
    nickName: "ANDROIDNEKO",
    avatar: "assets/imgs/author_logo2.png"
  };

  constructor(
    public events: Events,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private net: TyNetworkServiceProvider,
    public device:DeviceIntefaceServiceProvider,
    private db: DbServiceProvider) {
      super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.db.getString("username", (msg) => {
      this.username = msg;
      console.log("username:" + msg);
    });
    this.db.getString("password", (msg) => {
      this.password = msg;
      console.log("password:" + msg);
    });
  }

  tryLogin(username, password) {
    if (!this.isInfoLegal(username, password)){
      return;
    }
    this.login(username, password)
    .then( ()=>{
      console.log("then --> loginSuccess");
      this.setRootTab(AppServiceProvider.getInstance().userinfo.appType);
    }, (error) =>{
      console.log("then --> login "+error);

      this.toast(error);
    });
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      this.net.httpPost(
        AppGlobal.API.login,
        {
          "username": username,
          "pwd": password,
          "appType":AppServiceProvider.getInstance().userinfo.appType
          // "password":Md5.hashStr(password).toString().toLowerCase()
        },
        msg => {
          let obj = JSON.parse(msg);
          AppServiceProvider.getInstance().userinfo.username = obj.username;
          AppServiceProvider.getInstance().userinfo.userid = obj.userid;
          AppServiceProvider.getInstance().userinfo.token = obj.token;
          this.db.saveString(username, "username");
          this.device.push("updateUserInfo",JSON.stringify(AppServiceProvider.getInstance().userinfo));
          resolve();
        },
        error => {
          reject(error);
        },
        true);
    });
  }

  keydown(event) {
    if (event.keyCode == 13) {
      //返回确定按钮
      event.target.blur();
      return false;
    }
  }

  isInfoLegal(username, password) {
    if (username.length == 0) {
      this.toast("请输入用户名");
      return false;
    } else if (password.length == 0) {
      this.toast("请输入密码");
      return false;
    }
    return true;
  }

  setRootTab(appType:string){
    if (appType ==="Cy"){
      this.navCtrl.setRoot("CollectionTabPage");
    }
    else if (appType ==="Zy"){
      this.navCtrl.setRoot("PreparationPage");
    }
    else if (appType ==="Lz"){
      this.navCtrl.setRoot("BuildingPage");
    }
    else if (appType ==="Jc"){
      this.navCtrl.setRoot("BuildingPage");
    }
  }

  forgetpassword() {
    console.log("忘记密码")
    this.navCtrl.setRoot("ForgetPasswordPage").catch((err: any) => {
      console.log(`Didn't set nav root: ${err}`);
    });
    // this.navCtrl.setRoot("PostDetailPage").catch((err: any) => {
    //   console.log(`Didn't set nav root: ${err}`);
    // });
    
  }

  registBtnCliked() {
    console.log("注册按钮点击");
    this.navCtrl.setRoot("RegistPage").catch((err: any) => {
      console.log(`Didn't set nav root: ${err}`);
    });
  }
}
