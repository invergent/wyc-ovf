import { DashboardComponent } from './dashboard.component';
import {
  authenticatorMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    component = new DashboardComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
