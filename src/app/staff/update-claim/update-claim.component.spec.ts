import { UpdateClaimComponent } from './update-claim.component';
import { overtimeServiceMock, routerMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: UpdateClaimComponent;

  beforeEach(() => {
    component = new UpdateClaimComponent(overtimeServiceMock, routerMock)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
