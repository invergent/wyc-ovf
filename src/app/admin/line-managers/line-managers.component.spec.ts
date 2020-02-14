import { LineManagersComponent } from './line-managers.component';
import { mockToastr, mockJQuery, profileServiceMock } from 'src/app/__mocks__';
import { FormSubmissionService } from 'src/app/shared';

describe('HolidaysComponent', () => {
  let component: LineManagersComponent;
  const rfss = new FormSubmissionService();

  beforeEach(() => {
    component = new LineManagersComponent(profileServiceMock, rfss, mockToastr, mockJQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
