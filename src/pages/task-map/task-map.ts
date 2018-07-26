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

  markers = [{lat:"30.5678",lng:"114.3456"},
  {lat:"30.778",lng:"114.6352"},
  {lat:"30.2342",lng:"114.2342"},
  {lat:"30.6456",lng:"114.56756"},
  {lat:"30.2342",lng:"114.2524"},
  {lat:"30.235",lng:"114.4767"},
  {lat:"30.345345",lng:"114.45746"}];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  //public map: any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskMapPage');
    this.loadMap();
    
  }

  loadMap() {
    let map = new AMap.Map('mapView', {
      zoom: 12,
      center: [116.39, 39.9]
    });
    AMap.plugin('AMap.ToolBar',function(){
      var toolbar = new AMap.ToolBar();
      map.addControl(toolbar);
   })

    this.markers.forEach(element => {
      this.addMarker(map,new AMap.LngLat(element.lng,element.lat));
    });
    map.setFitView();// 执行定位
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
}
