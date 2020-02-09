import { AdminsComponent } from './admins.component';
import { mockToastr, profileServiceMock } from 'src/app/__mocks__';

describe('AdminsComponent', () => {
  let component: AdminsComponent;

  beforeEach(() => {
    component = new AdminsComponent(profileServiceMock, mockToastr);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
