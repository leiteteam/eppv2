import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
export class TaskMapPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  map: any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskMapPage');
    this.loadMap();
  }



  loadMap() {
    // this.map = new AMap.Map('mapView', {
    //   resizeEnable: true,
    //   zoom: 8,
    //   center: [114.39, 35.5]
    // });

    this.map = new AMap.Map('mapView', {
      zoom: 12,
      center: [116.39, 39.9]
    });
    AMap.plugin(['AMap.ToolBar', 'AMap.Geolocation'], function () {//异步加载插件
      var toolbar = new AMap.ToolBar();
      this.map.addControl(toolbar);
      // var locate = new AMap.Geolocation();
      // map.addControl(locate);
    });

  }

  // 实例化点标记
  addMarker(lnglatXY) {
    //console.log(lnglatXY);
    let marker = new AMap.Marker({
      icon: "http://webapi.amap.com/theme/v1.3/markers/b/loc.png",
      position: lnglatXY
    });
    marker.setMap(this.map);
    this.map.setFitView();// 执行定位
  }
}
