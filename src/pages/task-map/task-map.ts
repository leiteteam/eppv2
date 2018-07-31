import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';

/**
 * Generated class for the TaskMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-map',
  templateUrl: 'task-map.html',
})
export class TaskMapPage extends BasePage{

  public map: any;
  curLocMarker:any;

  allMarkers:any[] = [];
  undownMarkers:any[] = [];
  downloadedMarkers:any[] = [];
  uploadedMarkers:any[] = [];
  returnedMarkers:any[] = [];

  constructor(
    public net:TyNetworkServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public device:DeviceIntefaceServiceProvider,
    public toastCtrl:ToastController,
    public modalCtrl:ModalController) {
      super(navCtrl,navParams,toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskMapPage');
    this.loadMap();
    this.requestAllTasks()
        .then(()=>{
          this.updateMarkers();
          this.showAll();
          this.showTaskSummary();
        });
  }

  loadMap() {
    let map = new AMap.Map('mapView', {
      resizeEnable: true,
      zoom: 12,
      center: [116.39, 39.9]
    });
    AMap.plugin('AMap.ToolBar',function(){
      var toolbar = new AMap.ToolBar();
      map.addControl(toolbar);
   })

    // this.markers.forEach(element => {
    //   this.addMarker(map,new AMap.LngLat(element.lng,element.lat));
    // });
    // map.setFitView();// 执行定位

    this.map = map;
  }

  // 实例化点标记
  addMarker(map,lnglatXY) {
    //console.log(lnglatXY);
    let marker = new AMap.Marker({
      icon: "assets/imgs/marker.png",
      position: lnglatXY
    });
    marker.setMap(map);
    //this.map.setFitView();// 执行定位
  }

  locate(){
    this.navCtrl.push("FindEntPage",{entLng:114.4567,entLat:30.5678});
    // this.device.push("location","",(location)=>{
    //   if (this.curLocMarker && this.map){
    //       this.map.remove(this.curLocMarker);
    //   }
    //   location = JSON.parse(location);
    //   let lnglatXY = new AMap.LngLat(location.lng,location.lat);
    //   this.curLocMarker = new AMap.Marker({
    //     icon: "assets/imgs/loc.png",
    //     position: lnglatXY
    //   });
    //   this.map.add(this.curLocMarker);
    //   this.map.setZoom(15);// 执行定位
    //   this.map.setCenter(lnglatXY);
    //   }, (err)=>{
    //     this.toast("定位失败，请在室外空旷处再试!");
    //   }
    // );
  }

  showAll(){
    this.map.clearMap();
    this.map.add(this.allMarkers);
    this.map.setFitView();// 执行定位
  }

  showUndown(){
    this.map.clearMap();
    this.map.add(this.undownMarkers);
    this.map.setFitView();// 执行定位
  }

  showDownloaded(){
    this.map.clearMap();
    this.map.add(this.downloadedMarkers);
    this.map.setFitView();// 执行定位
  }

  showUploaded(){
    this.map.clearMap();
    this.map.add(this.uploadedMarkers);
    this.map.setFitView();// 执行定位
  }

  showReturned(){
    this.map.clearMap();
    this.map.add(this.returnedMarkers);
    this.map.setFitView();// 执行定位
  }

  updateMarkers(){
    console.log("-------updateMarkers-------");
    this.allMarkers = [];
    this.undownMarkers = [];
    this.downloadedMarkers = [];
    this.uploadedMarkers = [];
    this.returnedMarkers = [];

    AppServiceProvider.getInstance().undownTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude,element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker.png",
        position: lnglat
      });
      this.allMarkers.push(marker);
      this.undownMarkers.push(marker);
    });

    AppServiceProvider.getInstance().downloadedTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude,element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker.png",
        position: lnglat
      });
      this.allMarkers.push(marker);
      this.downloadedMarkers.push(marker);
    });

    AppServiceProvider.getInstance().uploadedTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude,element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker.png",
        position: lnglat
      });
      this.allMarkers.push(marker);
      this.uploadedMarkers.push(marker);
    });

    AppServiceProvider.getInstance().returnedTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude,element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker.png",
        position: lnglat
      });
      this.allMarkers.push(marker);
      this.returnedMarkers.push(marker);
    });
  }

  requestAllTasks(){
    return new Promise((resolve, reject) => {
      this.net.httpPost(
        AppGlobal.API.taskList,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token": AppServiceProvider.getInstance().userinfo.token,
          "statu":0
        },
        msg => {
          console.log(msg);
    
          let info = JSON.parse(msg);
          //let info = this.testData;
          AppServiceProvider.getInstance().undownTaskList = [];
          AppServiceProvider.getInstance().downloadedTaskList = [];
          AppServiceProvider.getInstance().uploadedTaskList = [];
          AppServiceProvider.getInstance().returnedTaskList = [];

          AppServiceProvider.getInstance().spleTeam = info.GroupName;
          AppServiceProvider.getInstance().teamMember = info.GroupMember;

          info.Tasks.forEach(element => {
            let task:any = element;
            task.category = info.category;
            task.GroupName = info.GroupName;
            task.GroupMember = info.GroupMember;
            // 1 待下载 2 待采样 4 已上传 5 已撤回
            if (task.SampleStatus == 1){
              AppServiceProvider.getInstance().undownTaskList.push(task);
            }
            if (task.SampleStatus == 2){
              //do nothing...改状态由本地维护，直到本地上传成功
              AppServiceProvider.getInstance().downloadedTaskList.push(task);
            }
            if (task.SampleStatus == 4){
              AppServiceProvider.getInstance().uploadedTaskList.push(task);
            }
            if (task.SampleStatus == 5){
              AppServiceProvider.getInstance().returnedTaskList.push(task);
              AppServiceProvider.getInstance().undownTaskList.push(task);
            }
      
          });
          resolve();
        },
        error => {
          this.toastShort(error);
        },
        true);
    });
  }

  testData = {
    "ret": 200,
    "desc": "OK",
    "GroupName": "采样小组01",
    "GroupMember": "管理员、何璐、十路",
    "category": [{
      "CategoryID": "A1",
      "CategoryName": "A1类-重金属",
      "ParamList": ["镉",
      "铅",
      "锌",
      "汞",
      "镍",
      "砷",
      "铜",
      "铬"]
    },
    {
      "CategoryID": "A4",
      "CategoryName": "A4类-可提取态重金属",
      "ParamList": ["可提取态镉",
      "可提取态铅",
      "可提取态锌",
      "可提取态汞",
      "可提取态镍",
      "可提取态砷",
      "可提取态铜",
      "可提取态铬"]
    },
    {
      "CategoryID": "C1",
      "CategoryName": "C1类-多环芳烃类15种",
      "ParamList": ["苯并[a]蒽",
      "屈",
      "二苯并[a,h]蒽",
      "苊",
      "菲",
      "荧蒽",
      "芘",
      "茚并[1,2,3-c,d]芘"]
    }],
    "Tasks": [{
      "TaskID": 85,
      "InvestigationCode": "",
      "ForecastAddress": "辽宁省大连市保税区亮甲店街道",
      "PointCategory": 1,
      "RegionalType": 0,
      "SampleNumber": "XW210262021",
      "RegionName": "大连市",
      "Longitude": "121.94563293457",
      "Latitude": "39.1869888305664",
      "GroupLeader": "cy000102",
      "CompletedTime": "",
      "InvestigationType": 0,
      "IsTestDhft": true,
      "IsTestZjsktq": true,
      "ZcxmParams": "",
      "ZcxmOtherParams": "",
      "CompanyName": "",
      "CompanyAddress": "",
      "CLongitude": "",
      "CLatitude": "",
      "MeshSize": "",
      "SampleStatus": 1,
      "QualityType": 0,
      "MainSampleId": "XW210262021S",
      "SampleCategory": 1
    },
    {
      "TaskID": 84,
      "InvestigationCode": "",
      "ForecastAddress": "辽宁省大连市保税区亮甲店街道",
      "PointCategory": 1,
      "RegionalType": 0,
      "SampleNumber": "XW210262020",
      "RegionName": "大连市",
      "Longitude": "121.927452087402",
      "Latitude": "39.1829299926758",
      "GroupLeader": "cy000102",
      "CompletedTime": "",
      "InvestigationType": 0,
      "IsTestDhft": true,
      "IsTestZjsktq": true,
      "ZcxmParams": "",
      "ZcxmOtherParams": "",
      "CompanyName": "",
      "CompanyAddress": "",
      "CLongitude": "",
      "CLatitude": "",
      "MeshSize": "",
      "SampleStatus": 1,
      "QualityType": 0,
      "MainSampleId": "XW210262020S",
      "SampleCategory": 1
    },
    {
      "TaskID": 83,
      "InvestigationCode": "",
      "ForecastAddress": "辽宁省大连市保税区亮甲店街道",
      "PointCategory": 1,
      "RegionalType": 0,
      "SampleNumber": "XW210262019",
      "RegionName": "大连市",
      "Longitude": "121.918502807617",
      "Latitude": "39.1831207275391",
      "GroupLeader": "cy000102",
      "CompletedTime": "",
      "InvestigationType": 0,
      "IsTestDhft": true,
      "IsTestZjsktq": true,
      "ZcxmParams": "",
      "ZcxmOtherParams": "",
      "CompanyName": "",
      "CompanyAddress": "",
      "CLongitude": "",
      "CLatitude": "",
      "MeshSize": "",
      "SampleStatus": 1,
      "QualityType": 0,
      "MainSampleId": "XW210262019S",
      "SampleCategory": 1
    }]
  };
  
  showTaskSummary(){
    const modal = this.modalCtrl.create("TaskSummaryDialogPage");
    modal.present();
  }
}
