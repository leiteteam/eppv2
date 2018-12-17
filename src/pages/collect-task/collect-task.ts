import { Events } from 'ionic-angular/util/events';
import { DbServiceProvider } from './../../providers/db-service/db-service';
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
  distanceNum:number = 500;
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
  disInterval: any;
  tipContent:string = "状态更改成功！";
  isStateFlag:boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, 
    public device:DeviceIntefaceServiceProvider, private camera: Camera, public alertCtrl:AlertController,
    public db:DbServiceProvider, public events:Events ) {
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
      this.sampleData.WJSampleTool = "铁铲";
      this.sampleData.WJSampleContainer = "布袋";
      this.db.getString("organicSplTool",organicSplTool=>{
        if (organicSplTool) {
          this.sampleData.WJSampleTool = organicSplTool
        }
      });
      this.db.getString("organicSplContainer",organicSplContainer=>{
        if (organicSplContainer) {
          this.sampleData.WJSampleContainer = organicSplContainer
        }
      });
      this.db.getString("abioSplTool",abioSplTool=>{
        if (abioSplTool) {
          this.sampleData.YJSampleTool = abioSplTool
        }
      });
      this.db.getString("abioSplContainer",abioSplContainer=>{
        if (abioSplContainer) {
          this.sampleData.YJSampleContainer = abioSplContainer
        }
      });
    }
  }
  ionViewDidEnter(){
    this.disInterval = setInterval(() =>{
      if(this.isFlagInput){
        return;
      }
      this.device.push("gps_location","",(location)=>{
        location = JSON.parse(location);
        this.sampleData.FactLongitude = location.lng;
        this.sampleData.FactLatitude = location.lat;
        this.sampleData.DeviationDistance = this.getDistance(this.taskData.Point.Latitude, this.taskData.Point.Longitude, location.lat, location.lng);
        }, (err)=>{
          this.toast("定位失败，请在室外空旷处再试!");
        }
      );
    }, 1000);
  }
  ionViewDidLeave(){
   clearInterval(this.disInterval);
  }
  getLatLng(){
    if(this.isFlagInput){
      this.toast("查看模式，禁止编辑！");
      return;
    }
    this.device.push("gps_location","",(location)=>{
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
    console.log("作用类型:" + this.sampleData.cropType + ", 土地利用:" + this.sampleData.soilMake + ", 土壤类型:" + this.sampleData.CropType);
    if(this.isFlagInput){
      this.navCtrl.pop();
      return;
    }
    if(!this.sampleData.FactLongitude || !this.sampleData.FactLatitude || this.sampleData.SampleDepthFrom == null || this.sampleData.soilMake == 10 || this.sampleData.cropTypes == 10 ||
      this.sampleData.SampleDepthFrom.toString() == "" || this.sampleData.SampleDepthTo == null || this.sampleData.SampleDepthTo.toString() == "" ||
     !this.sampleData.Weight || this.sampleData.SoilTexture == 0 || this.sampleData.SoilColor == 0 ){
      this.toast("请将带*的信息输入完整！");
      return;
    }
    if( this.gpsView == null || this.sampleProcess == null || this.samplePerson == null){
      this.toast("GPS屏显、采样工作过程、采样负责人3张图片必须拍摄！");
      return;
    }
    if(this.sampleData.DeviationDistance > this.distanceNum && (this.changeImg == null || !this.sampleData.ChangeReason)){
      this.toast("偏移距离超过" + this.distanceNum + "米必须填写变更说明和拍摄变更照片！");
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
    if(this.spleTask.samples.SampleCode == ''){
      this.isStateFlag = false;
      this.tipContent = "但主样没有制码！";
    } else
    if(!this.sampleData.FactAddress || this.sampleData.Altitude == '' || this.sampleData.IrrigationMethod == 0 || this.sampleData.IrrigationType == 0 ||
    this.sampleData.TerrainType == 0 || this.sampleData.Weather == 0 || !this.sampleData.DueEast || !this.sampleData.DueSouth || 
    !this.sampleData.DueWest || !this.sampleData.DueNorth || this.sampleData.soilMake == 10 || this.sampleData.cropType == 10 ){
      this.isStateFlag = false;
      this.tipContent = "但样点信息未填写完整！";
    } else if(pictures.length < (this.changeImg == null ? 11 : 12)){
      this.isStateFlag = false;
      this.tipContent = "但样点方位照没有拍全！";
    } else if(!this.spleTask.samples.isCompany){
      this.isStateFlag = false;
      this.tipContent = "但企业信息没有填写！";
    }
    this.sampleData.Pictures = pictures;
    this.sampleData.TaskID = this.spleTask.taskid;
    //有数据保存将状态改为已编辑
    this.taskData.editFlag = true;
    //复制内存中当前的spleTask，用于数据保存
    //因为在上层ts中，完整的json对象才是可用可解析的，如果直接将spleTask的字段改成了string则无法识别
    //原始spleTask仍用于内存中使用，所以需保持同步更新字段内容
    let date = new Date();
    if( this.sampleData.SamplingTime == '' ){
      this.sampleData.SamplingTime =  this.formatDateTime(date);
    }
    this.spleTask['samples'] = this.sampleData;
    this.spleTask['data'] = this.taskData;
    let savingData = JSON.parse(JSON.stringify(this.spleTask));
    //如果不满足条件   则不改变任务状态，仅保存
    if(this.isStateFlag){
      this.spleTask.state = 1;
      savingData.state = 1;
    }
    if(this.model == 0){
      this.device.push("stopTracing",this.spleTask.taskid,success=>{
        console.log(success);
        this.spleTask['samples'].route = success;
        savingData.samples.route = success;
        //这里我们复制出一个对象用于保存，将字段变换成底层接口需要的形式
        savingData.samples = JSON.stringify(this.sampleData);
        savingData.data = JSON.stringify(this.taskData);
        let savingDataStr = JSON.stringify(savingData);
        this.device.push("saveSample",savingDataStr, success=> {
          this.toast("保存成功," + this.tipContent);
          this.navCtrl.popToRoot();
          this.events.publish('tabChanged', null);
        }, error => {
          console.log(error);
          this.toast(error);
        });
      }, error => {
        console.log(error);
      });
    }else {
      //这里我们复制出一个对象用于保存，将字段变换成底层接口需要的形式
      savingData.samples = JSON.stringify(this.sampleData);
      savingData.data = JSON.stringify(this.taskData);
      let savingDataStr = JSON.stringify(savingData);
      this.device.push("saveSample",savingDataStr, success=> {
        this.toast("保存成功," + this.tipContent);
        this.navCtrl.popToRoot();
        this.events.publish('tabChanged', null);
      }, error => {
        console.log(error);
        this.toast(error);
      });
    }
  }
  //跳转制码
  goSampleCode(){
    this.navCtrl.push("SampleCodePage", {model: this.model, taskData: this.taskData, sampleData: this.sampleData});
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
    if(this.isFlagInput){
      return;
    }
    // 设置选项
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      saveToPhotoAlbum: true,
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
      //清理缓存的图片文件
      this.camera.cleanup();
     }, (err) => {
       console.log(err);
      // Handle error
     });
  }
  aletBigImg(imgBuf:String,titleName:any){
    let alert = this.alertCtrl.create({
      title: titleName,
      message: '<img src="data:image/jpeg;base64,'+ imgBuf +'" />',
      buttons: [ {text: '关闭'} ]
    });
    alert.present();
  }
  //删除照片
  delImg(loc){
    if(this.isFlagInput){
      return;
    }
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
  toolBtn(){
    let titleName = "采样工具";
    let alert = this.alertCtrl.create();
    alert.setTitle( titleName + "-多选框" );

    alert.addInput({
      type: 'checkbox',
      label: '铁铲',
      value: '铁铲'
    });
    alert.addInput({
      type: 'checkbox',
      label: '土钻',
      value: '土钻'
    });
    alert.addInput({
      type: 'checkbox',
      label: '木铲',
      value: '木铲'
    });
    alert.addInput({
      type: 'checkbox',
      label: '竹片',
      value: '竹片'
    });
    alert.addInput({
      type: 'checkbox',
      label: '其他',
      value: '其他'
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        if(data.length <= 0){
          this.toast("未选择工具");
          return;
        }
        let datas: String = data.join(",");
        this.sampleData.WJSampleTool = datas;
      }
    });
    alert.present();
  }
  containerBtn(){
    let titleName = "采样容器";

    let alert = this.alertCtrl.create();
    alert.setTitle( titleName + "-多选框" );

    alert.addInput({
      type: 'checkbox',
      label: '布袋',
      value: '布袋'
    });
    alert.addInput({
      type: 'checkbox',
      label: '聚乙烯袋',
      value: '聚乙烯袋'
    });
    alert.addInput({
      type: 'checkbox',
      label: '棕色磨口瓶',
      value: '棕色磨口瓶'
    });
    alert.addInput({
      type: 'checkbox',
      label: '其他',
      value: '其他'
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        if(data.length <= 0){
          this.toast("未选择容器");
          return;
        }
        let datas: String = data.join(",");
        this.sampleData.WJSampleContainer = datas;
      }
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
        { text: '壤土', value: 7 },
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
  humiditys: any = [
    {
      name: '',
      options: [        
        { text: '请选择', value: 10 },
        { text: '干', value: 0 },
        { text: '潮', value: 1 },
        { text: '湿', value: 2 },
        { text: '重潮', value: 3 },
        { text: '极潮', value: 4 },
      ]
    }
  ];
  soilTypes2: any = [
    {
      name: '',
      options: [        
        { text: '请选择', value: 99 },
        { text: '砖红壤', value: 0 },
        { text: '赤红壤', value: 1 },
        { text: '红壤和黄壤', value: 2 },
        { text: '黄棕壤', value: 3 },
        { text: '棕壤', value: 4 },
        { text: '暗棕壤', value: 5 },
        { text: '寒棕壤', value: 6 },
        { text: '褐土', value: 7 },
        { text: '黑钙土', value: 8 },
        { text: '栗钙土', value: 9 },
        { text: '棕钙土', value: 10 },
        { text: '黑垆土', value: 11 },
        { text: '荒漠土', value: 12 },
        { text: '草甸土', value: 13 },
        { text: '漠土', value: 14 },
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
  formatDateTime(inputTime) {  
    let date = inputTime;
    let y = date.getFullYear();  
    let m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    let d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;  
    second = second < 10 ? ('0' + second) : second; 
    return y + '-' + m + '-' + d+' ' + h + ':' + minute + ':' + second;  
}
}

