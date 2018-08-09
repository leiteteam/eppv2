import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SpleCodePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'spleCode',
})
export class SpleCodePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    let opt = value[0];
    let spleCode = value[1];
    let offset = parseInt(value[2]);
    if (opt == "1"){
      if (spleCode.length > 2){
        let mainSpleCode = spleCode.substring(0,spleCode.length-2);
        let subSpleCode = spleCode.substring(spleCode.length-2);
        return mainSpleCode + (parseInt(subSpleCode)+offset);
      }
    }else {
      return spleCode;
    }
  }
}
