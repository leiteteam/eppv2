import { BasePage } from './../base/base';
import { DeviceIntefaceServiceProvider } from './../../providers/device-inteface-service/device-inteface-service';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the CollectTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collect-task',
  templateUrl: 'collect-task.html',
})
export class CollectTaskPage extends BasePage {
  //callback:any;
  spleTask:any;
  taskData:any;
  sampleData:any;
  isFlagInput:boolean = false;
  gpsView:String;
  sampleProcess:String;
  samplePerson:String;
  changeImg:String;
  distance:number = 0;
  model:number = 0;
  isStateFlag:boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, 
    public device:DeviceIntefaceServiceProvider, private camera: Camera, public alertCtrl:AlertController) {
    super(navCtrl, navParams, toastCtrl);
    //this.callback = navParams.get("callback");
    this.spleTask = navParams.get('spleTask');
    this.taskData = this.spleTask['data'];
    this.sampleData = this.spleTask['samples'];
    //this.taskData = navParams.get("taskData");
    //this.sampleData = navParams.get("sampleData");
    this.model = this.navParams.data.model;
    if (this.model == 2) {
      this.isFlagInput = true;
    }
    let pictures = this.sampleData['Pictures'];
    for(let index in pictures){
      switch(pictures[index].type){
        case "GPS屏显":
          this.gpsView = pictures[index].base64;
          break;
        case "采样工作过程":
          this.sampleProcess = pictures[index].base64;
          break;
        case "采样负责人":
          this.samplePerson = pictures[index].base64;
          break;
        case "变更照片":
          this.changeImg = pictures[index].base64;
          break;
      }
    }
  }
  getLatLng(){
    this.device.push("location","",(location)=>{
      location = JSON.parse(location);
      this.sampleData.FactLongitude = location.lng;
      this.sampleData.FactLatitude = location.lat;
      this.sampleData.DeviationDistance = this.getDistance(this.taskData.Point.Latitude, this.taskData.Point.Longitude, location.lat, location.lng);
      }, (err)=>{
        this.toast("定位失败，请在室外空旷处再试!");
      }
    );
  }
  //保存
  save(){
    if(!this.sampleData.FactLongitude || !this.sampleData.FactLatitude || this.sampleData.SampleDepthFrom == null || 
      this.sampleData.SampleDepthFrom == '' || this.sampleData.SampleDepthTo == null || this.sampleData.SampleDepthTo == '' ||
     !this.sampleData.Weight || this.sampleData.SoilTexture == 0 || this.sampleData.SoilColor == 0 ){
      this.toast("请将带*的信息输入完整！");
      return;
    }
    if( this.gpsView == null || this.sampleProcess == null || this.samplePerson == null){
      this.toast("GPS屏显、采样工作过程、采样负责人3张图片必须拍摄！");
      return;
    }
    if(this.sampleData.DeviationDistance > 50 && (this.changeImg == null || !this.sampleData.ChangeReason)){
      this.toast("偏移距离超过50米必须填写变更说明和拍摄变更照片！");
      return;
    }
    let pictures:any = JSON.stringify(this.sampleData.Pictures);
    pictures = JSON.parse(pictures);
    for( let i=0, flag=true; i < pictures.length; flag ? i++ : i ){
      if( pictures[i].type == "GPS屏显" || pictures[i].type == "采样工作过程" || pictures[i].type == "采样负责人" || pictures[i].type == "变更照片" ){
        pictures.splice(i, 1);
        flag = false;
      }else {
        flag = true;
      }
    }
    if(this.gpsView){
      pictures.push({ type: "GPS屏显", base64: this.gpsView });
    }
    if(this.sampleProcess){
      pictures.push({ type: "采样工作过程", base64: this.sampleProcess });
    }
    if(this.samplePerson){
      pictures.push({ type: "采样负责人", base64: this.samplePerson });
    }
    if(this.changeImg){
      pictures.push({ type: "变更照片", base64: this.changeImg });
    }
    if(!this.sampleData.FactAddress || this.sampleData.Altitude == '' || this.sampleData.IrrigationMethod == 0 || this.sampleData.IrrigationType == 0 ||
    this.sampleData.TerrainType == 0 || this.sampleData.Weather == 0 || !this.sampleData.DueEast || !this.sampleData.DueSouth || 
    !this.sampleData.DueWest || !this.sampleData.DueNorth){
      this.isStateFlag = false;
      this.toast("样点信息未填写完整！");
    } else if(pictures.length < (this.changeImg == null ? 7 : 8)){
      this.isStateFlag = false;
      this.toast("样点方位照没有拍全！");
    } else if(!this.navParams.data.isCompany){
      this.isStateFlag = false;
      this.toast("企业信息没有填写！");
    }
    this.sampleData.Pictures = pictures;
    this.sampleData.TaskID = this.spleTask.taskid;

    //复制内存中当前的spleTask，用于数据保存
    //因为在上层ts中，完整的json对象才是可用可解析的，如果直接将spleTask的字段改成了string则无法识别
    //原始spleTask仍用于内存中使用，所以需保持同步更新字段内容
    let date = new Date();
    if( this.spleTask.SamplingTime = '' ){
      this.spleTask.SamplingTime =  date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    let savingData = JSON.parse(JSON.stringify(this.spleTask));
    this.spleTask['samples'] = this.sampleData;
    this.spleTask['data'] = this.taskData;
    //如果不满足条件   则不改变任务状态，仅保存
    if(this.isStateFlag){
      this.spleTask.state = 1;
      savingData.state = 1;
    }
    //这里我们复制出一个对象用于保存，将字段变换成底层接口需要的形式
    savingData.samples = JSON.stringify(this.sampleData);
    savingData.data = JSON.stringify(this.taskData);

    let savingDataStr = JSON.stringify(savingData);
    console.log(savingDataStr);
    this.device.push("saveSample",savingDataStr, success=> {
      if(this.model == 0){
        this.device.push("stopTracing",this.spleTask.taskid,success=>{
          console.log(success);
        }, error => {
          console.log(error);
        });
      }
      this.toast("保存成功！");
      this.navCtrl.popToRoot();
      console.log(success);
    }, error => {
      console.log(error);
      this.toast(error);
    });

  }
  //跳转制码
  goSampleCode(){
    this.navCtrl.push("SampleCodePage", {taskData: this.taskData, sampleData: this.sampleData});
  }
  //拍照
  addImg(loc){
    switch(loc){
      case 1:
        if(this.gpsView != null && this.gpsView != ''){
          this.aletBigImg(this.gpsView,'GPS屏显');
          return ;
        }
        break;
      case 2:
        if(this.sampleProcess != null && this.sampleProcess != ''){
          this.aletBigImg(this.sampleProcess,'采样工作过程');
          return ;
        }
        break;
      case 3:
      if(this.samplePerson != null && this.samplePerson != ''){
        this.aletBigImg(this.samplePerson,'采样负责人');
        return ;
      }
        break;
      case 4:
      if(this.changeImg != null && this.changeImg != ''){
        this.aletBigImg(this.changeImg,'变更照片');  
        return ;
      }
        break;
    }
    // 设置选项
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      targetHeight:520,
      targetWidth:360
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = imageData;
      switch(loc){
        case 1:
          this.gpsView = base64Image;
          break;
        case 2:
          this.sampleProcess = base64Image;
          break;
        case 3:
          this.samplePerson = base64Image;
          break;
        case 4:
          this.changeImg = base64Image;
          break;
      }
     }, (err) => {
       console.log(err);
      // Handle error
     });
  }
  aletBigImg(imgBuf:String,titleName:any){
    let alert = this.alertCtrl.create({
      title: titleName,
      message: '<img src="'+ imgBuf +'" />',
      buttons: [ {text: '关闭'} ]
    });
    alert.present();
  }
  //删除照片
  delImg(loc){
    let alert = this.alertCtrl.create({
      title: '删除提示',
      message: '你确定删除该图片？',
      buttons: [
        {
          text: '取消'
        },
        {
          text: '确定',
          handler: () => {
            switch(loc){
              case 1:
                this.gpsView = null;
                break;
              case 2:
                this.sampleProcess = null;
                break;
              case 3:
                this.samplePerson = null;
                break;
              case 4:
                this.changeImg = null;
                break;
            }
          }
        }
      ]
    });
    alert.present();
  }
  controlSamples: any = [
    {
      name: '',
      options: [
        { text: '无', value: 0 },
        { text: '普通质控样', value: 5 },
        { text: '有机质控样', value: 2 },
        { text: '无机质控样', value: 1 },
        { text: '有机和无机质控样', value: 3 },
        { text: '非质控样', value: 4 }
      ]
    }
  ];
  soilTypes: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: 0 },
        { text: '砂土', value: 1 },
        { text: '砂壤土', value: 2 },
        { text: '轻壤土', value: 3 },
        { text: '中壤土', value: 4 },
        { text: '重壤土', value: 5 },
        { text: '黏土', value: 6 },
        { text: '其它', value: 10 }
      ]
    }
  ];
  soilColors: any = [
    {
      name: '',
      options: [        
        { text: '请选择', value: 0 },
        { text: '黑', value: 1 },
        { text: '暗栗', value: 2 },
        { text: '暗棕', value: 3 },
        { text: '暗灰', value: 4 },
        { text: '栗', value: 5 },
        { text: '棕', value: 6 },
        { text: '灰', value: 7 },
        { text: '红棕', value: 8 },
        { text: '黄棕', value: 9 },
        { text: '浅棕', value: 10 },
        { text: '红', value: 11 },
        { text: '橙', value: 12 },
        { text: '黄', value: 13 },
        { text: '浅黄', value: 14 },
        { text: '白', value: 15 },
        { text: '其它' , value: 16 }
      ]
    }
  ];
  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectTaskPage');
  }
  
  getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    let radLat1 = lat1 * Math.PI / 180.0;
    let radLat2 = lat2 * Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10;
    return s;
  }
}

