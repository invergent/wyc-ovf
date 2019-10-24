import { AdminStaffComponent } from './admin-staff.component';
import { profileServiceMock, mockToastr, mockJQuery } from '../../__mocks__';
import { FormSubmissionService } from '../../shared';

const staffList = [
  { firstname: 'Johnny', lastname: 'Doe', emailAddress: 'j.doe@init.com' },
  { firstname: 'Jane', lastname: 'Doey', emailAddress: 'ja.doey@init.com' },
  { firstname: 'Bill', lastname: 'Cross', emailAddress: 'bill-crossy@init.com' }
];

const inputFile = {
  value: 'value',
  files: [{}]
}

const sampleFormValues = {
  staffId: 'TN012345',
  firstname: 'Johnny',
  lastname: 'Lastjohn',
  email: 'jon@last.com',
  phone: '8034567823'
}

describe('AdminStaffComponent', () => {
  let component: AdminStaffComponent;
  const rfss = new FormSubmissionService();

  beforeEach(() => {
    component = new AdminStaffComponent(profileServiceMock, rfss, mockToastr, mockJQuery);
  });

  it('should initialise staffList array', () => {
    component.ngOnInit();
    expect(component.visibleStaffList).toHaveLength(0);
    expect(component.staffList).toHaveLength(0);
    expect(component.currentPageStaffList).toHaveLength(0);
  });

  it('should run modal toggle functions', () => {
    component.runModalDisplay('bulkModal', 'param2');
    component.closeModal('bulkModal');

    expect(component.bulkModal).toBe(false);
  });

  it('should trigger file input"s click', () => {
    const mockClick = jest.fn();
    const jqMock = jest.fn(() => ({ click: mockClick }));
    const newComponent = new AdminStaffComponent(profileServiceMock, rfss, mockToastr, jqMock);
    newComponent.triggerFileInput();

    expect(mockClick).toHaveBeenCalled();
  });

  it('should increment or decrement currentPage value', () => {
    component.initialiseData();
    component.nextPage();

    expect(component.currentPage).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should update file input field state', () => {
    expect(component.fileInvalid).toBe(true);

    component.handleFileInput(inputFile);
    expect(component.fileInvalid).toBe(false);
    inputFile.value = undefined;
    component.handleFileInput(inputFile);
    expect(component.fileInvalid).toBe(true);
  })

  it('should filter staffList based on user"s input', () => {
    // @ts-ignore
    component.staffList = staffList;
    component.handleFiltering('y');

    expect(component.visibleStaffList).toHaveLength(3);
    expect(component.currentPageStaffList).toHaveLength(3);
  });

  it('should display errors if they exist when creating a single staff', async () => {
    const newSample = { ...sampleFormValues, staffId: 'TN00000000000', phone: '080' };
    const toastrErrMock = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit(newSample, 'singleModal');

    expect(toastrErrMock).toHaveBeenCalledTimes(2);
  });

  it('should successfully create a single staff', async () => {
    const toastrSuccessMock = jest.spyOn(mockToastr, 'success');
    const syncMock = jest.spyOn(profileServiceMock, 'syncWithAPI');
    const initMock = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit(sampleFormValues, 'singleModal');

    expect(toastrSuccessMock).toHaveBeenCalled();
    expect(syncMock).toHaveBeenCalled();
    expect(initMock).toHaveBeenCalled();
  });

  it('should display errors if staff creation fails (display server validation errors)', async () => {
    jest.clearAllMocks();
    const mockErr = { error: { message: 'message', errors: ['error', 'error', 'error'] } }
    const toastrErrMock = jest.spyOn(mockToastr, 'error');
    jest.spyOn(profileServiceMock, 'createSingle').mockRejectedValueOnce(mockErr);

    await component.handleSubmit(sampleFormValues, 'singleModal');
    expect(toastrErrMock).toHaveBeenCalledTimes(3);
  });

  it('should display errors if staff creation fails (display message errors)', async () => {
    jest.clearAllMocks();
    const mockErr = { error: { message: 'message' } }
    const toastrErrMock = jest.spyOn(mockToastr, 'error');

    jest.spyOn(profileServiceMock, 'createSingle').mockRejectedValueOnce(mockErr);

    await component.handleSubmit(sampleFormValues, 'singleModal');
    expect(toastrErrMock).toHaveBeenCalledWith('message');
  });

  it('should display errors if staff creation fails (display generic(connection) errors)', async () => {
    jest.clearAllMocks();
    const mockErr = {}
    const toastrErrMock = jest.spyOn(mockToastr, 'error');

    jest.spyOn(profileServiceMock, 'createSingle').mockRejectedValueOnce(mockErr);

    await component.handleSubmit(sampleFormValues, 'singleModal');
    expect(toastrErrMock).toHaveBeenCalledWith('An error occurred. Please check your network connection');
  });
});
