import { ConvertCronTimePipe } from '../convert-cron-time.pipe';
import { cronstrueMock } from 'src/app/__mocks__';

describe('ConvertCronTimePipe', () => {
  it('should convert cron time to words', () => {
    const pipe = new ConvertCronTimePipe(cronstrueMock);
    const cronMock = jest.spyOn(cronstrueMock, 'toString');
    pipe.transform('cronTime')
    expect(cronMock).toHaveBeenCalledWith('cronTime');
  });
});
