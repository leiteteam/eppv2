import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the InvestigationTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'investigationType',
})
export class InvestigationTypePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    switch(value){
      case 1:
      return "大气污染型";
      case 2:
      return "灌溉水污染型";
      case 3:
      return "其他类型";
    }
    return "类型不存在";
  }
}
