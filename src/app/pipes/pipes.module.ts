import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageTransformPipe } from './image-transform.pipe';
import { TimeAgoPipe } from 'time-ago-pipe';

const declarations = [ImageTransformPipe, TimeAgoPipe]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations,
  exports: declarations
})
export class PipesModule { }
