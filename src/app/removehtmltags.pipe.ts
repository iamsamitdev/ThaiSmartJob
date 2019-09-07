import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removehtmltag',
})
export class RemovehtmltagPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    if (value) {
      var result = value.replace(/<\/?[^>]+>/gi, ""); //removing html tag using regex pattern
      return result;
    }
    else { }


  }
}