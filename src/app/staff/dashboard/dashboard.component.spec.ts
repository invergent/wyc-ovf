import { DashboardComponent } from './dashboard.component';
import {
  authServiceMock, overtimeServiceMock
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    component = new DashboardComponent(authServiceMock, overtimeServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should should fetch staff details and claim statistics when component loads', () => {
    const fetchstatsMethod = jest.spyOn(overtimeServiceMock, 'fetchStaffClaimStatistics');

    component.ngOnInit();

    expect(fetchstatsMethod).toHaveBeenCalled();
  });

  it('should display error message if an error occurs while fetching claim statistics.', () => {
    const fetchstatsMethod = jest.spyOn(overtimeServiceMock, 'fetchStaffClaimStatistics').mockRejectedValue('err');

    try {
      component.ngOnInit();
    } catch(e) {
      expect(fetchstatsMethod).toHaveBeenCalled();
      expect(component.errorMessage).toBe('Unable to load content. Please reload');
      expect(component.showLoader).toBe(false);
    }
  });
});
