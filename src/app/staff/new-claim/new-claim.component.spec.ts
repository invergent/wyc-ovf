import { NewClaimComponent } from './new-claim.component';
import {
  authServiceMock, overtimeServiceMock, routerMock, mockToastr, mockJQuery
} from '../../__mocks__';

jest.useFakeTimers();

describe('New Claim', () => {
  let component: NewClaimComponent;

  beforeEach(() => {
    component = new NewClaimComponent(
      authServiceMock, overtimeServiceMock, routerMock, mockToastr, mockJQuery
    );
  });

  it('should set currentStaffs role', () => {
    component.ngOnInit();

    expect(component.staffRole).toBe('someRole');
  });

  it('should initialize datePicker by calling jQuery method with the element and days to ignore on calender', () => {
    component.initializeDatePicker('#someElement', [0, 1]);

    expect(mockJQuery).toHaveBeenCalled();
  });

  it('should toggle claim buttons when pressed and initialize calender on each', () => {
    const datePickerInitializer = jest.spyOn(component, 'initializeDatePicker').mockImplementation(() => {});

    component.toggleButtonPress('weekdayClicked');
    component.toggleButtonPress('weekendClicked');
    component.toggleButtonPress('shiftClicked');
    jest.runAllTimers();

    expect(component.weekdayClicked).toBe(true);
    expect(component.weekendClicked).toBe(true);
    expect(component.shiftClicked).toBe(true);
    expect(datePickerInitializer).toHaveBeenCalledTimes(9);
  });

  it('should return previous month', () => {

    const previousMonthDate = component.previousMonthDate();
    const previousMonth = previousMonthDate.getMonth();
    const previousMonthFromNow = new Date().getMonth() - 1;

    expect(previousMonth).toEqual(previousMonthFromNow);
  });

  it('should return errors if errors occur', async () => {
    component.weekdayClicked = true;
    component.weekendClicked = true;
    //@ts-ignore
    const toastrErrorFunction = jest.spyOn(mockToastr, 'error')

    await component.handleSubmit();

    expect(toastrErrorFunction).toHaveBeenCalledTimes(2);
  });

  it('should make the call to create overtime request', async () => {
    const routerMockFunc = jest.spyOn(routerMock, 'navigate');
    const overtimeServiceMockFunc = jest.spyOn(overtimeServiceMock, 'createOvertimeRequest');
    const toastrSuccessFunction = jest.spyOn(mockToastr, 'success');
    const mockJQueryVal = jest.fn().mockReturnValue({
      val: () => '29/04/2019, 30/04/2019'
    });

    const newComponent = new NewClaimComponent(
      authServiceMock, overtimeServiceMock, routerMock, mockToastr, mockJQueryVal
    );
    newComponent.weekdayClicked = true;
    newComponent.weekendClicked = true;

    await newComponent.handleSubmit();

    expect(toastrSuccessFunction).toHaveBeenCalledWith('created successfully!');
    expect(overtimeServiceMockFunc).toHaveBeenCalledWith({ weekday: 2, weekend: 2 });
    expect(routerMockFunc).toHaveBeenCalledWith(['/staff/dashboard']);
  });

  it('should dispaly error messages when they occur while creating overtime request', async () => {
    jest.spyOn(overtimeServiceMock, 'createOvertimeRequest').mockRejectedValue({ error: 'error' });
    const toastrErrorFunction = jest.spyOn(mockToastr, 'error');
    const mockJQueryVal = jest.fn().mockReturnValue({
      val: () => '29/04/2019, 30/04/2019'
    });

    const newComponent = new NewClaimComponent(
      authServiceMock, overtimeServiceMock, routerMock, mockToastr, mockJQueryVal
    );
    newComponent.weekdayClicked = true;
    newComponent.weekendClicked = true;

    await newComponent.handleSubmit();

    expect(toastrErrorFunction).toHaveBeenCalled();
  });

  it('should display multiple error messages when they occur while creating overtime request', async () => {
    const errors = { error: { errors: ['many', 'many', 'erros'] } };
    jest.spyOn(overtimeServiceMock, 'createOvertimeRequest').mockRejectedValue(errors);
    const toastrErrorFunction = jest.spyOn(mockToastr, 'error');
    const mockJQueryVal = jest.fn().mockReturnValue({
      val: () => '29/04/2019, 30/04/2019'
    });

    const newComponent = new NewClaimComponent(
      authServiceMock, overtimeServiceMock, routerMock, mockToastr, mockJQueryVal
    );
    newComponent.weekdayClicked = true;
    newComponent.weekendClicked = true;

    await newComponent.handleSubmit();

    expect(toastrErrorFunction).toHaveBeenCalled();
  });
});
