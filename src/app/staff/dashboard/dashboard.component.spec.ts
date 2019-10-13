import { DashboardComponent } from './dashboard.component';
import {
  authServiceMock, overtimeServiceMock, activatedRouteMock
} from '../../__mocks__';

describe('Dashboard', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    component = new DashboardComponent(authServiceMock, activatedRouteMock, overtimeServiceMock);
  });

  it('should should fetch staff details and claim statistics when component loads', () => {
    const fetchDataMock = jest.spyOn(overtimeServiceMock, 'fetchStaffData');

    component.ngOnInit();

    expect(fetchDataMock).toHaveBeenCalled();
  });

  it('should display error message if an error occurs while fetching staff data.', () => {
    const fetchDataMock = jest.spyOn(overtimeServiceMock, 'fetchStaffData').mockRejectedValue('err');

    try {
      component.ngOnInit();
    } catch(e) {
      expect(fetchDataMock).toHaveBeenCalled();
      expect(component.errorMessage).toBe('Unable to load content. Please reload');
      expect(component.showLoader).toBe(false);
    }
  });
});
