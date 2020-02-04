import { LogsComponent } from './logs.component';
import { overtimeServiceMock, mockToastr, mockJQuery, logServiceMock, profileServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: LogsComponent;

  beforeEach(() => {
    component = new LogsComponent(logServiceMock, profileServiceMock, mockToastr, mockJQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
