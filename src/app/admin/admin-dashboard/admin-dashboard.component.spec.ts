import { AdminDashboardComponent } from './admin-dashboard.component';
import { authServiceMock, overtimeServiceMock } from 'src/app/__mocks__';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;

  beforeEach(() => {
    component = new AdminDashboardComponent(authServiceMock, overtimeServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should should fetch admin claims data and chart statistics when component loads', () => {
    const fetchDataMock = jest.spyOn(overtimeServiceMock, 'fetchAdminData');

    component.ngOnInit();

    expect(fetchDataMock).toHaveBeenCalled();
  });

  it('should display error message if an error occurs while fetching admin data.', () => {
    const fetchDataMock = jest.spyOn(overtimeServiceMock, 'fetchAdminData').mockRejectedValue('err');

    try {
      component.ngOnInit();
    } catch(e) {
      expect(fetchDataMock).toHaveBeenCalled();
      expect(component.errorMessage).toBe('Unable to load content. Please reload');
      expect(component.showLoader).toBe(false);
    }
  });
});
