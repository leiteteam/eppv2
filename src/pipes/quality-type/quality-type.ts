import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the QualityTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'qualityType',
})
export class QualityTypePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    switch(value){
      case 1:
      return "无机质控样";
      case 2:
      return "有机质控样";
      case 3:
      return "有机和无机质控样";
      case 4:
      return "非质控样";
      case 5:
      return "普通质控样";
    }
    return "无";
  }
}