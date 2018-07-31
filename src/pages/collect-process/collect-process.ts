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
  newCompany:any;
  taskData: any;
  sampleData: any;
  eastImg: String;
  southImg: String;
  westImg: String;
  northImg: String;
  dueEast: String;
  dueSouth: String;
  dueWest: String;
  dueNorth: String;
  spleTask: any;
  isFlagInput: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    private camera: Camera, private alertCtrl: AlertController) {
    super(navCtrl, navParams, toastCtrl);
    //初始化json
    this.initJson();
    this.spleTask = navParams.get('spleTask');
    //this.taskData = this.spleTask['data'];
    if (this.spleTask['sample'] != null && !this.isEmptyObject(this.spleTask['sample'])) {
      this.sampleData = this.spleTask['sample'];
    }
    this.newCompany = this.sampleData['company'];
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
    console.log(this.sampleData);
  }
  aroundBtn(num) {
    if (this.isFlagInput) {
      return;
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('多选框');

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
            this.dueEast = datas;
            break;
          case 2:
            this.dueSouth = datas;
            break;
          case 3:
            this.dueWest = datas;
            break;
          case 4:
            this.dueNorth = datas;
            break;
        }
      }
    });
    alert.present();
  }
  //拍照
  getImg(loc) {
    if (this.isFlagInput) {
      return;
    }
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
    // 设置选项
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
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
  irrigateWay = '';
  irrigateWays: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: '' },
        { text: '地面灌溉', value: '地面灌溉' },
        { text: '喷灌', value: '喷灌' },
        { text: '微灌', value: '微灌' }
      ]
    }
  ];
  irrigateType = '';
  irrigateTypes: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: '' },
        { text: '地表水', value: '地表水' },
        { text: '地下水', value: '地下水' },
        { text: '污水', value: '污水' },
        { text: '其他', value: '其它' }
      ]
    }
  ];
  terrainType = '';
  terrainTypes: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: '' },
        { text: '山地', value: '山地' },
        { text: '平原', value: '平原' },
        { text: '丘陵', value: '丘陵' },
        { text: '沟谷', value: '沟谷' },
        { text: '岗地', value: '岗地' },
        { text: '其他', value: '其它' }
      ]
    }
  ];
  weatherSetting = '';
  weatherSettings: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: '' },
        { text: '晴', value: '晴' },
        { text: '阴', value: '阴' },
        { text: '下雨', value: '下雨' },
        { text: '下雪', value: '下雪' }
      ]
    }
  ];
  collectTask = (sampleData) => {
    return new Promise((resolve, reject) =>{
      console.log(sampleData);
      resolve();
    })
  }
  collcetTaskBtn() {
    this.navCtrl.push("CollectTaskPage",{callback: this.collectTask, model: 0, taskData: this.taskData, sampleData: this.sampleData});
  }
  sampleInfoBtn() {
    this.navCtrl.push('SampleInfoPage', { taskData: this.taskData });
  }
  companyInfo = (company) => {
    return new Promise((resolve, reject) => {
      this.newCompany = company;
      resolve();
    });
  }
  companyInfoBtn() {
    this.navCtrl.push('CompanyInfoPage', { callback: this.companyInfo, Company: this.taskData.Company, model: 0, newCompany: this.newCompany });
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
      message: '<img src="' + imgBuf + '" />',
      buttons: [{ text: '关闭' }]
    });
    alert.present();
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
    this.taskData = {
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
      "TaskID": 85,
      "GroupLeader": "cy000102",
      "CompletedTime": "",
      "MeshSize": "",
      "SampleStatus": 1,
      "MainSampleId": "XW210262021S",
      "QualityType": 1,
      "SampleCategory": 1,
      "Point": {
        "InvestigationCode": "",
        "PointName": "测试点位3",
        "ForecastAddress": "辽宁省大连市保税区亮甲店街道",
        "PointCategory": 1,
        "RegionalType": 0,
        "SampleNumber": "XW210262021",
        "RegionName": "大连市",
        "Longitude": "121.94563293457",
        "Latitude": "39.1869888305664",
        "InvestigationType": 0,
        "SoilFsType": "发生分类",
        "SoilXtType": "系统分类",
        "IsTestDhft": true,
        "IsTestZjsktq": false,
        "ZcxmParams": "",
        "ZcxmOtherParams": ""
      },
      "Company": {
        "CompanyName": "某某公司",
        "CompanyAddress": "某某省某某区某某地址",
        "CLongitude": "121.94563293457",
        "CLatitude": "39.1869888305664"
      }
    };
    this.sampleData = {
      "TaskID": 83,
      "FactAddress": "样点实际地址",
      "Altitude": 10,
      "IrrigationMethod": 1,
      "IrrigationType": 1,
      "TerrainType": 2,
      "Weather": 1,
      "DueEast": "居民点",
      "DueSouth": "居民点,水域",
      "DueWest": "耕地",
      "DueNorth": "耕地",
      "PollutantRemark": "周边无潜在污染源",
      "FactLongitude": 110.231234,
      "FactLatitude": 23.2344123,
      "DeviationDistance": 20,
      "ChangeReason": "无",
      "SampleDepthFrom": 10,
      "SampleDepthTo": 30,
      "SampleDepthRemark": "正常深度采样",
      "QualityType": 2,
      "Weight": 2500,
      "SoilTexture": 2,
      "SoilColor": 8,
      "SampleRemark": "样品说明内容",
      "SampleTool": "1,2",
      "SampleContainer": "1,3",
      "SamplingTime": "2018-07-28",
      "TaskType": 1,
      "YjParamCatetoryIDs": "A1, B1, C1",
      "Pictures": [],
      "SubSamples": [
        {
          "SubSampleId": "s1",
          "SubSampleType": 1,
          "TwoSampleId": "ss1",
          "LaboratorySampleId": "sss1",
          "ProjectType": 1,
          "Weight": 250,
          "ParamCatetoryID": "B1",
          "ParamNames": "B1类-溴仿等4种；B2类-甲苯3种；B3类-硝基苯"
        },
        {
          "SubSampleId": "s2",
          "SubSampleType": 1,
          "TwoSampleId": "ss2",
          "LaboratorySampleId": "sss2",
          "ProjectType": 1,
          "Weight": 250,
          "ParamCatetoryID": "B1",
          "ParamNames": "B1类-溴仿等4种；B2类-甲苯3种；B3类-硝基苯"
        }
      ],
      "company": {
        "FactCompanyName": "公司实际名称",
        "Industry": 7,
        "FactAddress": "公司实际地址",
        "FactLongitude": 113.111111,
        "FactLatitude": 23.222222,
        "DeviationDistance": 100
      }
    }
  }
}
