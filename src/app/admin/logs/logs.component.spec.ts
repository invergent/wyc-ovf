import { LogsComponent } from './logs.component';
import { mockToastr, mockJQuery, logServiceMock, profileServiceMock } from 'src/app/__mocks__';

describe('LogsComponent', () => {
  let component: LogsComponent;

  beforeEach(() => {
    component = new LogsComponent(logServiceMock, profileServiceMock, mockToastr, mockJQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
