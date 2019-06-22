import { Pipe, PipeTransform, Inject } from '@angular/core';
import { CRONSTRUE_TOKEN, ICronstrue } from '../shared';

@Pipe({
  name: 'convertCronTime'
})
export class ConvertCronTimePipe implements PipeTransform {
  constructor(@Inject(CRONSTRUE_TOKEN) private cronstrueService: ICronstrue) {}
  transform(cronTime: string): string {
    // cronTime always receives a null value first; this hack prevents the error that results from passing null to cronstrue
    return this.cronstrueService.toString(cronTime || '* * * * *').slice(3); 
  }
}
