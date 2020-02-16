import { AdminClaimsComponent } from './admin-claims.component';
import { overtimeServiceMock, mockToastr, authServiceMock } from 'src/app/__mocks__';

describe('AdminClaimsComponent', () => {
  let component: AdminClaimsComponent;

  beforeEach(() => {
    component = new AdminClaimsComponent(overtimeServiceMock, authServiceMock, mockToastr);
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
