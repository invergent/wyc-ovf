import { ClaimsComponent } from './claims.component';
import {
  profileServiceMock, overtimeServiceMock, mockToastr
} from '../../__mocks__';

describe('Claim', () => {
  let component: ClaimsComponent;

  beforeEach(() => {
    component = new ClaimsComponent(overtimeServiceMock, profileServiceMock, mockToastr);
    //@ts-ignore
    component.claims = [{ status: 'Cancelled'}, { status: 'Declined'}, { status: 'Completed'}, { status: 'Processing'}]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
