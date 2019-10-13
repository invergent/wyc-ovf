import { ViewClaimComponent } from './view-claim.component';
import { activatedRouteMock, routerMock, overtimeServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ViewClaimComponent;

  beforeEach(() => {
    component = new ViewClaimComponent(activatedRouteMock, routerMock, overtimeServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
