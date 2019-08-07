import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPaneItemName'
})
export class FormatPaneItemNamePipe implements PipeTransform {
  transform(value: string): string {
    return value ? this.pipeValue(value) : '';
  }

  pipeValue(value) {
    value = `${value.charAt(0).toUpperCase()}${value.substr(1)}`;
    return value
      .replace(/Atm/g, 'ATM')
      .replace(/MD/g, 'M D')
      .replace(/MS/g, 'M S')
      .replace(/tD/g, 't D')
      .replace(/Outstation/g, 'Out of Station');
  }
}
