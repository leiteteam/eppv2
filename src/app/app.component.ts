import { DbServiceProvider } from './../providers/db-service/db-service';
import { Events } from 'ionic-angular/util/events';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Keyboard, IonicApp, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeviceIntefaceServiceProvider } from '../providers/device-inteface-service/device-inteface-service';
import { AppServiceProvider } from '../providers/app-service/app-service';

export interface PageInterface {
  title: string;
  name: string;
  component: any;//对应跳转的独立页面
  icon: string;
  ios?: string;
  md?: string;
  logsOut?: boolean;
  index?: number; //tab index,如非tab页面，可空
  tabName?: string;
  tabComponent?: any;//对应跳转的tab页面
  leafPage?: any;//是否可为子页面
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  backButtonPressed: boolean = false;
  rootPage: any;
  avatarUrl: string = "assets/imgs/author_logo2.png";
  logoUrl: string = "assets/imgs/visitor.png";
  userName: string = "androidcat";

  hasLoggedIn:boolean = false;
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  rootPages:Array<string> = ["HomePage","LoginPage","RegistPage","CollectionTabPage","PreparationPage","FlowingPage","TestingPage"];

  constructor(
    public db:DbServiceProvider,
    public platform: Platform,
    public ionicApp:IonicApp,
    public statusBar: StatusBar,
    public toastCtrl: ToastController,
    public keyboard:Keyboard,
    public splashScreen: SplashScreen,
    public device:DeviceIntefaceServiceProvider,
    public events: Events) {

    this.platform.ready().then(() => {
      console.log("platform has been ready...");
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      if (this.platform.is("android")) {
        this.statusBar.backgroundColorByHexString("#8aa88f");
        this.registerBackButtonAction();
      }
      this.eventsregisterTokenErrEvent();
      //判断登录状态，并跳转
      this.checkLogin();
    });
  }

  eventsregisterTokenErrEvent(){
    this.events.subscribe('tokenError150',()=>{
      this.toastCtrl.create({
        message: '该帐号已在其他设备登录，请重新登录',
        duration: 2000,
        position: 'bottom',
        cssClass: 'text-align: center'
      }).present();
      this.nav.setRoot("LoginPage");
    });
  }

  checkLogin(){
    this.getUsername()
        .then(username=>{
          return this.getUserInfo(username);
        })
        .then(()=>{
          this.setRootTab(AppServiceProvider.getInstance().userinfo.appType);
        })
  }

  getUsername(){
    return new Promise((resolve,reject)=>{
      this.db.getString("username",username=>{
        if (username){
          resolve(username);
        }else {
          this.setRootTab(null);
        }
      });
    });
  }

  getUserInfo(username){
    return new Promise((resolve,reject)=>{
      this.device.push("getUserInfo",username,infoStr=>{
        let userInfo = JSON.parse(infoStr);
        AppServiceProvider.getInstance().userinfo = userInfo;
        resolve();
      },err=>{
        this.setRootTab(null);
      });
    });
  }

  platformReady(appType) {
    this.setRootTab(appType);
  }

  setRootTab(appType:string){
    this.splashScreen.hide();
    if (appType ==="Cy"){
      this.rootPage = "CollectionTabPage";
    }
    else if (appType ==="Zy"){
      this.rootPage = "PreparationPage";
    }
    else if (appType ==="Lz"){
      this.rootPage = "FlowingPage";
    }
    else if (appType ==="Jc"){
      this.rootPage = "TestingPage";
    }
    else {
      this.rootPage = "HomePage";
    }
  }

  isActive(page: PageInterface): boolean {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected()) {
        let selected = childNav.getSelected().root;
        if (selected && selected === page.name){
          return true;
        }
      }
      return false;
    }

    if (this.nav.getActive() && this.nav.getActive().id === page.name) {
      return true;
    }
    return false;
  }

  openPage(page: PageInterface) {
    let params = {};
    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    // 从我们定义的PageInterface的结构来判断当前页面是tab框架子页面还是普通page
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    //这一段是如果当前app采用了tab的框架，那么tab页面之间的切换就不用重复setRoot，而是用tab index定位
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Set the root of the nav with params if it's a tab index
      //这里处理非tab框架的页面跳转，处于便利性考虑，目前我们将所有页面声明位MyApp的module，使用push的方式跳转
      if (page.leafPage) {
        this.nav.push(page.name);
      } else {
        this.nav.setRoot(page.name, params).catch((err: any) => {
          console.log(`Didn't set nav root: ${err}`);
        });
      }

      //this.nav.push(page.name);
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.events.publish('user:logout');
    }
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      console.log("this.keyboard.isOpen():" + this.keyboard.isOpen());
      if (this.keyboard.isOpen()) {
        //按下返回键时，先关闭键盘
        this.keyboard.close();
        return;
      };

      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.gaetActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
      //不写this.ionicApp._toastPortal.getActive()是因为连按2次退出
      let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();
      let loadingPortal = this.ionicApp._loadingPortal.getActive();

      if (activePortal) {
        //其他的关闭
        activePortal.dismiss().catch(() => {
        });
        activePortal.onDidDismiss(() => {
        });
        return;
      }
      if (loadingPortal) {
        //loading的话，返回键无效
        return;
      }

      let activeVC = this.nav.getActive();
      let page = activeVC.instance;

      if(page.tabs){        
        let activeNav = page.tabs.getSelected();
        if(activeNav.canGoBack()){
          return activeNav.pop();
        }else{
          return this.showExit();
        }       
      } 

      console.log("events go on ");
      if (this.rootPages.indexOf(this.nav.getActive().id) >= 0){
        return this.showExit();
      }
    }, 1);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即1秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 1000,
        position: 'bottom',
        cssClass: 'text-align: center'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 1000);//1秒内没有再次点击返回则将触发标志标记为false
    }
  }

}
