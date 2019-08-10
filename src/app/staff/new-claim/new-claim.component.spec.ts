import { NewClaimComponent } from './new-claim.component';
import { overtimeServiceMock, settingsServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: NewClaimComponent;

  beforeEach(() => {
    component = new NewClaimComponent(overtimeServiceMock, settingsServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
