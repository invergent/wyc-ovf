import { HolidaysComponent } from './holidays.component';
import { overtimeServiceMock, mockToastr, mockJQuery } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: HolidaysComponent;

  beforeEach(() => {
    component = new HolidaysComponent(overtimeServiceMock, mockToastr, mockJQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
