import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageTransformPipe } from './image-transform.pipe';

const declarations = [ImageTransformPipe]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations,
  exports: declarations
})
export class PipesModule { }
