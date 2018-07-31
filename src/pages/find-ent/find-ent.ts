import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { DeviceIntefaceServiceProvider } from '../../providers/device-inteface-service/device-inteface-service';

/**
 * Generated class for the FindEntPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-ent',
  templateUrl: 'find-ent.html',
})
export class FindEntPage extends BasePage{
  public map: any;
  entLng:number = 121.814207;
  entLat:number = 39.086521;
  curLocMarker:any;
  entMarker:any;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public device:DeviceIntefaceServiceProvider,
      public toastCtrl:ToastController,
    ) {
      super(navCtrl,navParams,toastCtrl);
      if (navParams.data.entlat && navParams.data.entLng){
        this.entLat = navParams.data.entlat;
        this.entLng = navParams.data.entLng;
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindEntPage');
    this.loadMap();
  }

  loadMap() {
    let map = new AMap.Map('mapContainer', {
      resizeEnable: true,
      zoom: 16,
      center: [this.entLng,this.entLat]
    });
    AMap.plugin('AMap.ToolBar',function(){
      var toolbar = new AMap.ToolBar();
      map.addControl(toolbar);
   })

   this.addMarker(map,new AMap.LngLat(this.entLng,this.entLat));
    // map.setFitView();// 执行定位

    this.map = map;
  }

  // 实例化点标记
  addMarker(map,lnglatXY) {
    //console.log(lnglatXY);
    this.entMarker = new AMap.Marker({
      icon: "assets/imgs/ent.png",
      draggable:true,
      map:map,
      position: lnglatXY
    });
    //this.map.setFitView();// 执行定位
  }

  locate(){
    this.device.push("location","",(location)=>{
      if (this.curLocMarker && this.map){
          this.map.remove(this.curLocMarker);
      }
      location = JSON.parse(location);
      let lnglatXY = new AMap.LngLat(location.lng,location.lat);
      this.curLocMarker = new AMap.Marker({
        icon: "assets/imgs/loc.png",
        position: lnglatXY
      });
      this.map.add(this.curLocMarker);
      this.map.setZoom(15);// 执行定位
      this.map.setCenter(lnglatXY);
      }, (err)=>{
        this.toast("定位失败，请在室外空旷处再试!");
      }
    );
  }

  done(){
    this.entLng = this.entMarker.getPosition().lng;
    this.entLat = this.entMarker.getPosition().lat;
    if (this.navParams.data.callback){
      this.navParams.data.callback({entLng:this.entLng,entLat:this.entLat});
    }
    console.log("this.entLng:"+this.entLng+"----this.entLat:"+this.entLat);
    this.navCtrl.pop();
  }
}
