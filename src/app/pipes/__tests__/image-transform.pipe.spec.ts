import { ImageTransformPipe } from '../image-transform.pipe';

describe('ImageTransformPipe', () => {
  it('should insert cloudinary"s image transform string into url string', () => {
    const pipe = new ImageTransformPipe();
    const mockUrl = 'something/upload/another';
    const transformedUrl = pipe.transform(mockUrl);

    expect(transformedUrl).toBe('something/upload/c_fill,g_face,h_400,r_max,w_400/another');
  });
});
