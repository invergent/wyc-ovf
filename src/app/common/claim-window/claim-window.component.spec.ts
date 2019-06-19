import { ClaimWindowComponent } from './claim-window.component';
import { settingsServiceMock } from 'src/app/__mocks__';

describe('ClaimWindowComponent', () => {
  let component: ClaimWindowComponent;

  beforeEach(() => {
    component = new ClaimWindowComponent(settingsServiceMock)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
