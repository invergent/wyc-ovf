import { ClaimsComponent } from './claims.component';
import {
  profileServiceMock, overtimeServiceMock
} from '../../__mocks__';

describe('Claim', () => {
  let component: ClaimsComponent;

  beforeEach(() => {
    component = new ClaimsComponent(overtimeServiceMock, profileServiceMock);
    //@ts-ignore
    component.claims = [{ status: 'Cancelled'}, { status: 'Declined'}, { status: 'Completed'}, { status: 'Processing'}]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
