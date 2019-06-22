import { AdminBranchComponent } from './admin-branch.component';
import { FormSubmissionService } from '../../shared';
import { profileServiceMock, mockToastr, mockJQuery } from 'src/app/__mocks__';
const branches = [
  { name: 'Morama', address: 'Morama random address' },
  { name: 'Jokiki', address: 'Jokiki random address than has more than sixty characters to display' }
];

const inputFile = {
  value: 'value',
  files: [{}]
}

const branchFormValues = {
  solId: '4834',
  name: 'Jalamkpa',
  address: '4, surgede close, agofo'
}

describe('AdminBranchComponent', () => {
  let component: AdminBranchComponent;
  const rfss = new FormSubmissionService();

  beforeEach(() => {
    component = new AdminBranchComponent(profileServiceMock, rfss, mockToastr, mockJQuery);
  });

  it('should initialise branches array', () => {
    const profileDataMock = jest.spyOn(profileServiceMock, 'fetchProfileData').mockResolvedValueOnce({ branches });
    component.ngOnInit();
    
    expect(profileDataMock).toHaveBeenCalled();
  });

  it('should run modal toggle functions', () => {
    component.runModalDisplay('bulkModal', 'param2');
    component.closeModal('bulkModal');

    expect(component.bulkModal).toBe(false);
  });

  it('should trigger file input"s click', () => {
    const mockClick = jest.fn();
    const jqMock = jest.fn(() => ({ click: mockClick }));
    const newComponent = new AdminBranchComponent(profileServiceMock, rfss, mockToastr, jqMock);
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

  it('should filter branches based on user"s input', () => {
    // @ts-ignore
    component.branches = branches;
    component.handleFiltering('j');

    expect(component.visibleBranches).toHaveLength(1);
    expect(component.currentPageBranches).toHaveLength(1);
  });

  it('should display errors if they exist when creating a single branch', async () => {
    const newSample = { solId: 'aldh', name: 'name', address: 'address' };
    const toastrErrMock = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit(newSample, 'singleModal');

    expect(toastrErrMock).toHaveBeenCalledTimes(1);
  });

  it('should successfully create a single branch', async () => {
    const toastrSuccessMock = jest.spyOn(mockToastr, 'success');
    const syncMock = jest.spyOn(profileServiceMock, 'syncWithAPI');
    const initMock = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit(branchFormValues, 'singleModal');

    expect(toastrSuccessMock).toHaveBeenCalled();
    expect(syncMock).toHaveBeenCalled();
    expect(initMock).toHaveBeenCalled();
  });

  it('should display errors if staff creation fails (display server validation errors)', async () => {
    jest.clearAllMocks();
    const mockErr = { error: { message: 'message', errors: ['error', 'error', 'error'] } }
    const toastrErrMock = jest.spyOn(mockToastr, 'error');
    jest.spyOn(profileServiceMock, 'createSingle').mockRejectedValueOnce(mockErr);

    await component.handleSubmit(branchFormValues, 'singleModal');
    expect(toastrErrMock).toHaveBeenCalledTimes(3);
  });

  it('should display errors if staff creation fails (display message errors)', async () => {
    jest.clearAllMocks();
    const mockErr = { error: { message: 'message' } }
    const toastrErrMock = jest.spyOn(mockToastr, 'error');

    jest.spyOn(profileServiceMock, 'createSingle').mockRejectedValueOnce(mockErr);

    await component.handleSubmit(branchFormValues, 'singleModal');
    expect(toastrErrMock).toHaveBeenCalledWith('message');
  });

  it('should display errors if staff creation fails (display generic(connection) errors)', async () => {
    jest.clearAllMocks();
    const mockErr = {}
    const toastrErrMock = jest.spyOn(mockToastr, 'error');

    jest.spyOn(profileServiceMock, 'createSingle').mockRejectedValueOnce(mockErr);

    await component.handleSubmit(branchFormValues, 'singleModal');
    expect(toastrErrMock).toHaveBeenCalledWith('An error occurred. Please check your network connection');
  });
});
