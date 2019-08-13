import { ViewClaimComponent } from './view-claim.component';
import { activatedRouteMock, profileServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ViewClaimComponent;

  beforeEach(() => {
    component = new ViewClaimComponent(activatedRouteMock, profileServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
