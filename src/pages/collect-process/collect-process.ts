import { DeviceIntefaceServiceProvider } from './../../providers/device-inteface-service/device-inteface-service';
import { BasePage } from './../base/base';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
/**
 * Generated class for the CollectProcessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collect-process',
  templateUrl: 'collect-process.html',
})
export class CollectProcessPage extends BasePage {
  newCompany: any;
  taskData: any;
  sampleData: any;
  eastImg: String;
  southImg: String;
  westImg: String;
  northImg: String;
  spleTask: any;
  tipContent:string = "!";
  isFlagInput: boolean = false;
  model: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    private camera: Camera, private alertCtrl: AlertController, public device: DeviceIntefaceServiceProvider) {
    super(navCtrl, navParams, toastCtrl);
    //初始化json
    this.initJson();
    this.spleTask = navParams.get('spleTask');
    console.log(this.spleTask);
    this.taskData = this.spleTask['data'];
    this.model = navParams.data.model;
    if (this.model == 2) {
      this.isFlagInput = true;
    }
    if (this.spleTask['samples'] != null && !this.isEmptyObject(this.spleTask['samples'])) {
      this.sampleData = this.spleTask['samples'];
      let pictures = this.sampleData['Pictures'];
      for (let index in pictures) {
        switch (pictures[index].type) {
          case "正东":
            this.eastImg = pictures[index].base64;
            break;
          case "正南":
            this.southImg = pictures[index].base64;
            break;
          case "正西":
            this.westImg = pictures[index].base64;
            break;
          case "正北":
            this.northImg = pictures[index].base64;
            break;
        }
      }
    } else {
      this.spleTask['samples'] = this.sampleData; 
    }
    if(this.spleTask.samples.isCompany == null){
      if (this.taskData.Point.IsYXQ) {
        this.spleTask.samples.isCompany = false;
      } else {
        this.spleTask.samples.isCompany = true;
      }
    }
  }
  isEmptyObject(obj: any) {
    for (let name in obj) {
      if (name != null) {
        return false;
      }
    }
    return true;
  }
  //保存
  sampleProcessBtn() {
    if(this.isFlagInput){
      this.navCtrl.push("CollectTaskPage", { model: this.model, spleTask: this.spleTask});
      return;
    }
    let pictures: any = JSON.stringify(this.sampleData.Pictures);
    pictures = JSON.parse(pictures);
    for (let i = 0, flag = true; i < pictures.length; flag ? i++ : i) {
      if (pictures[i].type == "正东" || pictures[i].type == "正南" || pictures[i].type == "正西" || pictures[i].type == "正北") {
        pictures.splice(i, 1);
        flag = false;
      } else {
        flag = true;
      }
    }
    if (this.eastImg) {
      pictures.push({ type: "正东", base64: this.eastImg });
    }
    if (this.southImg) {
      pictures.push({ type: "正南", base64: this.southImg });
    }
    if (this.westImg) {
      pictures.push({ type: "正西", base64: this.westImg });
    }
    if (this.northImg) {
      pictures.push({ type: "正北", base64: this.northImg });
    }
    this.sampleData.Pictures = pictures;
    this.spleTask['samples'] = this.sampleData;
    //分段信息保存
    this.saveSample();
    if(!this.spleTask.samples.isCompany){
      this.tipContent = ",但企业信息没有填写！";
    }
    this.navCtrl.push("CollectTaskPage", { model: this.model, spleTask: this.spleTask});
  }
  //选择四周建筑物
  aroundBtn(name, num) {
    if (this.isFlagInput) {
      return;
    }
    let alert = this.alertCtrl.create();
    alert.setTitle(name + '-多选框');

    alert.addInput({
      type: 'checkbox',
      label: '居民区',
      value: '居民区'
    });

    alert.addInput({
      type: 'checkbox',
      label: '厂矿',
      value: '厂矿'
    });
    alert.addInput({
      type: 'checkbox',
      label: '耕地',
      value: '耕地'
    });
    alert.addInput({
      type: 'checkbox',
      label: '林地',
      value: '林地'
    });
    alert.addInput({
      type: 'checkbox',
      label: '草地',
      value: '草地'
    });
    alert.addInput({
      type: 'checkbox',
      label: '水域',
      value: '水域'
    });
    alert.addInput({
      type: 'checkbox',
      label: '其它',
      value: '其它'
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        let datas: String = data.join(",");
        switch (num) {
          case 1:
            this.sampleData.DueEast = datas;
            break;
          case 2:
            this.sampleData.DueSouth = datas;
            break;
          case 3:
            this.sampleData.DueWest = datas;
            break;
          case 4:
            this.sampleData.DueNorth = datas;
            break;
        }
      }
    });
    alert.present();
  }
  //拍照
  getImg(loc) {
    
    switch (loc) {
      case 1:
        if (this.eastImg != null && this.eastImg != '') {
          this.aletBigImg(this.eastImg, '正东');
          return;
        }
        break;
      case 2:
        if (this.southImg != null && this.southImg != '') {
          this.aletBigImg(this.southImg, '正南');
          return;
        }
        break;
      case 3:
        if (this.westImg != null && this.westImg != '') {
          this.aletBigImg(this.westImg, '正西');
          return;
        }
        break;
      case 4:
        if (this.northImg != null && this.northImg != '') {
          this.aletBigImg(this.northImg, '正北');
          return;
        }
        break;
    }
    if (this.isFlagInput) {
      return;
    }
    // 设置选项
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 520,
      targetWidth: 360
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = imageData;
      switch (loc) {
        case 1:
          this.eastImg = base64Image;
          break;
        case 2:
          this.southImg = base64Image;
          break;
        case 3:
          this.westImg = base64Image;
          break;
        case 4:
          this.northImg = base64Image;
          break;
      }
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }
  //删除照片
  delImg(loc) {
    if (this.isFlagInput) {
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
            switch (loc) {
              case 1:
                this.eastImg = null;
                break;
              case 2:
                this.southImg = null;
                break;
              case 3:
                this.westImg = null;
                break;
              case 4:
                this.northImg = null;
                break;
            }
          }
        }
      ]
    });
    alert.present();
  }
  irrigateWays: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: 0 },
        { text: '漫灌', value: 1 },
        { text: '喷灌', value: 2 },
        { text: '微灌', value: 3 },
        { text: '滴灌', value: 4 },
        { text: '渗灌', value: 5 },
        { text: '其他', value: 10 }
      ]
    }
  ];
  irrigateTypes: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: 0 },
        { text: '地表水', value: 1 },
        { text: '地下水', value: 2 },
        { text: '污水', value: 3 },
        { text: '其它', value: 4 }
      ]
    }
  ];
  terrainTypes: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: 0 },
        { text: '山地', value: 1 },
        { text: '平原', value: 2 },
        { text: '丘陵', value: 3 },
        { text: '沟谷', value: 4 },
        { text: '岗地', value: 5 },
        { text: '其他', value: 10 }
      ]
    }
  ];
  weatherSettings: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: 0 },
        { text: '晴', value: 1 },
        { text: '阴', value: 2 },
        { text: '下雨', value: 3 }
      ]
    }
  ];
  collectTask = (sampleData) => {
    return new Promise((resolve, reject) => {
      console.log(sampleData);
      resolve();
    })
  }
  collcetTaskBtn() {
    this.navCtrl.push("CollectTaskPage", { callback: this.collectTask, model: this.model, taskData: this.taskData, sampleData: this.sampleData });
  }

  findOnMap(){
    if (this.spleTask.data){
      this.device.push( "findOnMap", {lat:this.spleTask.data.Point.Latitude,lng:this.spleTask.data.Point.Longitude} );
    }
    if (this.spleTask.Point){
      this.device.push( "findOnMap", {lat:this.spleTask.Point.Latitude,lng:this.spleTask.Point.Longitude} );
    }
  }

  sampleInfoBtn() {
    this.navCtrl.push('SampleInfoPage', { taskData: this.taskData });
  }
  companyInfo = (company) => {
    return new Promise((resolve, reject) => {
      if(this.isFlagInput){
        return;
      }
      this.sampleData['company'] = company;
      this.spleTask['samples'] = this.sampleData;
      this.spleTask.samples.isCompany = true;
      this.saveSample();
      resolve();
    });
  }
  companyInfoBtn() {
    this.newCompany = this.sampleData['company'];
    this.navCtrl.push('CompanyInfoPage', { callback: this.companyInfo, Company: this.taskData.Company, model: this.model, newCompany: this.newCompany });
  }
  ionViewDidLoad() {
    //当页面进入初始化的时候
    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  aletBigImg(imgBuf: String, titleName: any) {
    let alert = this.alertCtrl.create({
      title: titleName,
      message: '<img src="data:image/jpeg;base64,' + imgBuf + '" />',
      buttons: [{ text: '关闭' }]
    });
    alert.present();
  }
  //分段保存
  saveSample(){
    let savingData = JSON.parse(JSON.stringify(this.spleTask));
    savingData.samples = JSON.stringify(this.sampleData);
    savingData.data = JSON.stringify(this.taskData);
    let savingDataStr = JSON.stringify(savingData);
    this.device.push("saveSample", savingDataStr, success => {
      this.toast("保存成功" + this.tipContent);
    }, error => {
      console.log(error);
      this.toast(error);
    });
  }

  //当退出页面的时候
  ionViewWillLeave() {
    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
  }
  initJson() {
    this.sampleData = {
      "TaskID": "",
      "SampleCode": "",
      "FactAddress": "",
      "Altitude": "",
      "IrrigationMethod": 0,
      "IrrigationType": 0,
      "TerrainType": 0,
      "Weather": 0,
      "DueEast": "",
      "DueSouth": "",
      "DueWest": "",
      "DueNorth": "",
      "PollutantRemark": "",
      "FactLongitude": '',
      "FactLatitude": '',
      "DeviationDistance": 0,
      "ChangeReason": "",
      "SampleDepthFrom": '',
      "SampleDepthTo": '',
      "SampleDepthRemark": "",
      "QualityType": 0,
      "Weight": '',
      "SoilTexture": 0,
      "SoilColor": 0,
      "SampleRemark": "",
      "SampleTool": "",
      "SampleContainer": "",
      "SamplingTime": "",
      "TaskType": '',
      "YjParamCatetoryIDs": "",
      "Pictures": [],
      "SubSamples": [],
      "company": {
        "FactCompanyName": "",
        "Industry": 0,
        "FactAddress": "",
        "FactLongitude": '',
        "FactLatitude": '',
        "DeviationDistance": ''
      }
    }
  }
}
