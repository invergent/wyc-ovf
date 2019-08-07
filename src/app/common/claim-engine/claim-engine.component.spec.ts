import { ClaimEngineComponent } from './claim-engine.component';
import {
  authServiceMock, settingsServiceMock, routerMock, mockToastr, mockJQuery,
  overtimeServiceMock, mockLocalStorage
} from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ClaimEngineComponent;

  beforeEach(() => {
    component = new ClaimEngineComponent(
      authServiceMock, overtimeServiceMock, settingsServiceMock, routerMock, mockToastr, mockJQuery, mockLocalStorage
    )
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
