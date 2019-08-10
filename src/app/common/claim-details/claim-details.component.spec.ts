import { ClaimDetailsComponent } from './claim-details.component';
import { mockJQuery, overtimeServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ClaimDetailsComponent;

  beforeEach(() => {
    component = new ClaimDetailsComponent(overtimeServiceMock, mockJQuery)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
