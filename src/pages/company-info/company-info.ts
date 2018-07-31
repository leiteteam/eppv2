import { BasePage } from './../base/base';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the CompanyInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-company-info',
  templateUrl: 'company-info.html',
})
export class CompanyInfoPage extends BasePage{
  callback:any;
  company: any;
  isFlagInput: boolean = false;
  newCompany: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController) {
    super(navCtrl,navParams,toastCtrl);
    this.callback = navParams.get("callback");
    this.company = this.navParams.get("Company");
    if (this.navParams.get("model") == 2) {
      this.isFlagInput = true;
    }
    this.newCompany = this.navParams.get("newCompany");
    this.companyType = this.newCompany["Industry"];
  }
  save(){
    if(!this.newCompany.FactCompanyName){
      this.toast("请输入现企业名称");
      return;
    }
    if(this.companyType == 0){
      this.toast("请选择企业行业");
      return;
    }
    if(!this.newCompany.FactAddress){
      this.toast("请输入现详细地址");
      return;
    }
    if(!this.newCompany.FactLongitude || !this.newCompany.FactLatitude){
      this.toast("请输入实际经/纬度");
      return;
    }
    this.callback(this.newCompany).then(() => { this.navCtrl.pop() });
  }
  companyType = 0;
  companyTypes: any = [
    {
      name: '',
      options: [
        { text: '请选择', value: 0 },
        { text: '石油和天然气开采业', value: 7 },
        { text: '黑色金属矿采选业', value: 8 },
        { text: '有色金属矿采选业', value: 9 },
        { text: '纺织业', value: '17' },
        { text: '皮革、毛皮、羽毛及其制品和制鞋业', value: 19 },
        { text: '石油加工、炼焦和核燃料加工业', value: 25 },
        { text: '化学原料和原因制品制造业', value: 6 },
        { text: '医药制造', value: 27 },
        { text: '化学纤维制造业', value: 28 },
        { text: '黑色金属冶炼和压延加工业', value: 31 },
        { text: '有色金属冶炼和压延加工业', value: 32 },
        { text: '金属制品业', value: 33 },
        { text: '电气机械和器材制造业', value: 38 },
        { text: '仓储业(设计原油、成品油、危化品以及金属矿物仓储)', value: 59 },
        { text: '危险废弃物和垃圾焚烧', value: 77 },
        { text: '其它', value: 999 }
      ]
    }
  ];
  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanyInfoPage');
  }
  getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    let radLat1 = lat1 * Math.PI / 180.0;
    let radLat2 = lat2 * Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  }
}
