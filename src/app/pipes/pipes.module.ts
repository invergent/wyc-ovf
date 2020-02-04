import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageTransformPipe } from './image-transform.pipe';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ConvertCronTimePipe } from './convert-cron-time.pipe';
import { FormatPaneItemNamePipe } from './format-pane-item-name.pipe';
import { FormatIsoDatePipe } from './format-iso-date.pipe';

const declarations = [
  ImageTransformPipe, TimeAgoPipe, ConvertCronTimePipe, FormatPaneItemNamePipe, FormatIsoDatePipe
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations,
  exports: declarations
})
export class PipesModule { }
