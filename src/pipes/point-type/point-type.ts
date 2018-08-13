import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PointTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'pointType',
})
export class PointTypePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    switch(value){
      case 1:
        return "表层土壤调查点位";
      case 2:
        return "农产品协同调查点位";
      case 3:
        return "深层土壤调查点位";
      case 4:
        return "复合调查点位";
    }
    return "无";
  }
}
