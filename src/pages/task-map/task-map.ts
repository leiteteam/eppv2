import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';
import { BasePage } from '../base/base';
import { TyNetworkServiceProvider } from '../../providers/ty-network-service/ty-network-service';
import { AppGlobal, AppServiceProvider } from '../../providers/app-service/app-service';
import { DbServiceProvider } from '../../providers/db-service/db-service';

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
export class TaskMapPage extends BasePage {

  public map: any;
  curLocMarker: any;

  //allMarkers: any[] = [];
  undownMarkers: any[] = [];
  downloadedMarkers: any[] = [];
  uploadedMarkers: any[] = [];
  returnedMarkers: any[] = [];
  selectedMarkers: any[] = [];

  lastLng = 121.907852;
  lastLat = 39.183170;

  checkState: any = {
    "dai": true,
    "cun": true,
    "chuan": true,
    "che": true
  };

  constructor(
    public net: TyNetworkServiceProvider,
    public db: DbServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public device: DeviceIntefaceServiceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController) {
    super(navCtrl, navParams, toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskMapPage');
    this.getLastLocation()
      .then(() => {
        this.refresh();
      });
  }

  getLastLocation() {
    return new Promise((resolve, reject) => {
      this.db.getString("lastLocation", lastLocation => {
        if (lastLocation) {
          let lng = lastLocation.split(",")[0];
          let lat = lastLocation.split(",")[1];
          this.lastLng = Number.parseFloat(lng);
          this.lastLat = Number.parseFloat(lat);
        }
        resolve();
      }, err => { resolve(); });
    });
  }

  loadMap() {
    return new Promise((resolve, reject) => {
      if (this.map) {
        resolve();
      } else {
        let map = new AMap.Map('mapView', {
          resizeEnable: true,
          zoom: 10,
          center: [this.lastLng, this.lastLat]
        });
        AMap.plugin(['AMap.ToolBar', 'AMap.MapType'], function () {
          var toolbar = new AMap.ToolBar();
          map.addControl(toolbar);
          var mapType = new AMap.MapType();
          map.addControl(mapType);
        })

        //this.addMarker(map, new AMap.LngLat(this.lastLng, this.lastLat));
        //map.setFitView();// 执行定位
        map.on('complete', function () {
          // 地图图块加载完成后触发
          console.log("-----地图图块加载完成-----");
        });

        this.map = map;
        resolve();
      }
    });
  }

  // 实例化点标记
  addMarker(map, lnglatXY) {
    //console.log(lnglatXY);
    let marker = new AMap.Marker({
      icon: "assets/imgs/marker.png",
      position: lnglatXY
    });
    marker.setMap(map);
    //this.map.setFitView();// 执行定位
  }

  locate() {
    this.device.push("location", "", (location) => {
      if (this.curLocMarker && this.map) {
        this.map.remove(this.curLocMarker);
      }
      location = JSON.parse(location);
      let lnglatXY = new AMap.LngLat(location.lng, location.lat);
      //缓存用户定位位置，用于下次加载默认地图位置使用
      this.db.saveString(location.lng + "," + location.lat, "lastLocation");
      this.curLocMarker = new AMap.Marker({
        icon: "assets/imgs/loc.png",
        position: lnglatXY
      });
      this.map.add(this.curLocMarker);
      this.map.setZoom(15);// 执行定位
      this.map.setCenter(lnglatXY);
    }, (err) => {
      this.toast("定位失败，请在室外空旷处再试!");
    }
    );
  }

  showSelected() {
    this.map.clearMap();
    this.map.add(this.selectedMarkers);
    this.fitMap(this.selectedMarkers);
  }

  updateMarkers() {
    console.log("-------updateMarkers-------");
    this.undownMarkers = [];
    this.downloadedMarkers = [];
    this.uploadedMarkers = [];
    this.returnedMarkers = [];

    AppServiceProvider.getInstance().undownTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude, element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker_download.png",
        position: lnglat
      });
      this.undownMarkers.push(marker);
    });

    AppServiceProvider.getInstance().downloadedTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude, element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker.png",
        position: lnglat
      });
      this.downloadedMarkers.push(marker);
    });

    AppServiceProvider.getInstance().uploadedTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude, element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker_done.png",
        position: lnglat
      });
      this.uploadedMarkers.push(marker);
    });

    AppServiceProvider.getInstance().returnedTaskList.forEach(element => {
      let lnglat = new AMap.LngLat(element.Point.Longitude, element.Point.Latitude);
      let marker = new AMap.Marker({
        icon: "assets/imgs/marker_return.png",
        position: lnglat
      });
      this.returnedMarkers.push(marker);
    });
  }

  requestAllTasks() {
    return new Promise((resolve, reject) => {
      this.net.httpPost(
        AppGlobal.API.taskList,
        {
          "username": AppServiceProvider.getInstance().userinfo.username,
          "token": AppServiceProvider.getInstance().userinfo.token,
          "statu": 0
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
            let task: any = element;
            task.category = info.category;
            task.GroupName = info.GroupName;
            task.GroupMember = info.GroupMember;
            // 1 待下载 2 待采样 4 已上传 5 已撤回
            if (task.SampleStatus == 1) {
              AppServiceProvider.getInstance().undownTaskList.push(task);
            }
            if (task.SampleStatus == 2) {
              //do nothing...改状态由本地维护，直到本地上传成功
              AppServiceProvider.getInstance().downloadedTaskList.push(task);
            }
            if (task.SampleStatus == 4) {
              AppServiceProvider.getInstance().uploadedTaskList.push(task);
            }
            if (task.SampleStatus == 5) {
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

  showTaskSummary() {
    const modal = this.modalCtrl.create("TaskSummaryDialogPage");
    modal.present();
  }

  refresh() {
    this.requestAllTasks()
      .then(() => { return this.loadAMapJs() })
      .then(() => { return this.loadMap() })
      .then(() => {
        this.updateMarkers();
        this.showTaskSummary();
        this.checkChange(true);
      });
  }

  fitMap(markers) {
    if (markers && markers.length > 0) {
      let zoom = 10;
      let marker = markers[0];

      this.map.setZoomAndCenter(zoom, [marker.getPosition().getLng(), marker.getPosition().getLat()]);// 执行定位
    }
  }

  checkChange(event) {
    console.log("daiChange---->" + event);
    this.selectedMarkers = [];
    if (this.checkState.dai) {
      this.selectedMarkers = this.selectedMarkers.concat(this.undownMarkers);
    }
    if (this.checkState.cun) {
      this.selectedMarkers = this.selectedMarkers.concat(this.downloadedMarkers);
    }
    if (this.checkState.chuan) {
      this.selectedMarkers = this.selectedMarkers.concat(this.uploadedMarkers);
    }
    if (this.checkState.che) {
      this.selectedMarkers = this.selectedMarkers.concat(this.returnedMarkers);
    }

    this.showSelected();
  }

  loadAMapJs(){
    return new Promise((resolve,reject)=>{
      if (typeof (AMap) == "undefined") {
          this.dynamicLoadJs("https://webapi.amap.com/maps?v=1.4.8&key=f93c4639c7efa00395c2bac42985a2c6",()=>{
          resolve();
        });
      }else {
        resolve();
      }
    }); 
  }

    /**
     * 动态加载JS
     * @param {string} url 脚本地址
     * @param {function} callback  回调函数
     */
    dynamicLoadJs(url, callback) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      if(typeof(callback)=='function'){
          script.onload =  function () {
            callback();
            script.onload = null;
          };
      }
      head.appendChild(script);
  }

}
