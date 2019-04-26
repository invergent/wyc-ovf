import { PendingClaimComponent } from './pending-claim.component';
import {
  authenticatorMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: PendingClaimComponent;

  beforeEach(() => {
    component = new PendingClaimComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
