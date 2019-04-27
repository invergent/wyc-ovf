import { ClaimHistoryComponent } from './claim-history.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: ClaimHistoryComponent;

  beforeEach(() => {
    component = new ClaimHistoryComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
