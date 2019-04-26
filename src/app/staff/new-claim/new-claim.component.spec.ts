import { NewClaimComponent } from './new-claim.component';
import {
  authenticatorMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: NewClaimComponent;

  beforeEach(() => {
    component = new NewClaimComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
