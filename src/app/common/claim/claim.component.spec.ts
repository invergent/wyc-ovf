import { ClaimComponent } from './claim.component';
import {
  authenticatorMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: ClaimComponent;

  beforeEach(() => {
    component = new ClaimComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
