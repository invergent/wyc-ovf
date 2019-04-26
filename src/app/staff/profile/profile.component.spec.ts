import { ProfileComponent } from './profile.component';
import {
  authenticatorMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: ProfileComponent;

  beforeEach(() => {
    component = new ProfileComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
