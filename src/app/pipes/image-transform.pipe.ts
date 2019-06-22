import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformImage'
})
export class ImageTransformPipe implements PipeTransform {

  transform(value: string): string {
    const urlFragments = value.split('upload');
    return `${urlFragments[0]}upload/c_fill,g_face,h_400,r_max,w_400${urlFragments[1]}`;
  }
}
