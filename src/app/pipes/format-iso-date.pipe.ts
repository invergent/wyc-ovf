import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatIsoDate'
})
export class FormatIsoDatePipe implements PipeTransform {

  transform(value): any {
    const [day, month, date, year, time] = new Date(value).toString().split(' ');
    return `${date}-${month}-${year} ${time}`;
  }
}
