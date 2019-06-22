import { ClaimHistoryComponent } from './claim-history.component';
import { overtimeServiceMock } from '../../__mocks__';

describe('Claim History', () => {
  let component: ClaimHistoryComponent;

  beforeEach(() => {
    component = new ClaimHistoryComponent(overtimeServiceMock);
  });

  it('should fetch staff claim history on load', () => {
    const fetchStaffData = jest.spyOn(overtimeServiceMock, 'fetchStaffData');

    component.ngOnInit();

    expect(fetchStaffData).toHaveBeenCalled();
  });

  it('should display error page if an error occurs while fetching claim history', () => {
    jest.spyOn(overtimeServiceMock, 'fetchStaffData').mockRejectedValue('err');
    const displayErr = jest.spyOn(component, 'displayError');

    try {
      component.ngOnInit();
    } catch (error) {
      expect(displayErr).toHaveBeenCalled();
    }
  });
});
