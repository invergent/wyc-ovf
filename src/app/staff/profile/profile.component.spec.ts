import { ProfileComponent } from './profile.component';
import {
  authServiceMock, profileServiceMock, formServiceMock, mockToastr, mockJQuery, overtimeServiceMock
} from '../../__mocks__';
import { FormSubmissionService } from 'src/app/shared';

describe('Comfirm password reset', () => {
  let component: ProfileComponent;

  beforeEach(() => {
    const realFSS = new FormSubmissionService();
    component = new ProfileComponent(
      authServiceMock, profileServiceMock, overtimeServiceMock, realFSS, mockToastr, mockJQuery
    );
  });

  it('should update current staff details on initialisation of component', async () => {
    const profileMock = jest.spyOn(profileServiceMock, 'fetchProfileData');

    await component.ngOnInit();

    expect(profileMock).toHaveBeenCalled();
    expect(component.currentStaff.firstname).toBe('somename');
  });

  it('should sync staff data with API', async () => {
    const authMock = jest.spyOn(authServiceMock, 'fetchStaffProfile');

    await component.syncStaffData();

    expect(authMock).toHaveBeenCalled();
  });

  it('should run modal toggle functions', () => {
    component.runModalDisplay('imageModal', 'param2');
    component.closeModal('imageModal');

    expect(component.imageModal).toBe(false);
  });

  it('should trigger file input"s click', () => {
    const mockClick = jest.fn();
    const jqMock = jest.fn(() => ({ click: mockClick }));
    const newComponent = new ProfileComponent(
      authServiceMock, profileServiceMock, overtimeServiceMock, formServiceMock, mockToastr, jqMock
    );
    newComponent.triggerFileInput();

    expect(mockClick).toHaveBeenCalled();
  });

  it('should toggle edit mode', () => {
    const mockCss = jest.fn();
    const jqMock = jest.fn(() => ({ css: mockCss }));
    const newComponent = new ProfileComponent(
      authServiceMock, profileServiceMock, overtimeServiceMock, formServiceMock, mockToastr, jqMock
    );
    expect(newComponent.editMode).toBe('none');

    newComponent.toggleEditMode();

    expect(newComponent.editMode).toBe('block');
    expect(mockCss).toHaveBeenCalledTimes(5);

    newComponent.toggleEditMode();

    expect(newComponent.editMode).toBe('none');
    expect(mockCss).toHaveBeenCalledTimes(10);
  });

  it('should insert cloudinary"s image transform string into url string', () => {
    const mockUrl = 'something/upload/another';
    const transformedUrl = component.transformImage(mockUrl);

    expect(transformedUrl).toBe('something/upload/c_fill,g_face,h_400,r_max,w_400/another');
  });

  it('should update open modal"s input fields on dropdown item select', () => {
    const mockText = jest.fn();
    const jqMock = jest.fn(() => ({ text: mockText }));
    const branchPayload = { id: 1, name: 'name' };
    const lineManagerPayload = { firstname: 'John', lastname: 'Doe', email: 'email' };

    const newComponent = new ProfileComponent(
      authServiceMock, profileServiceMock, overtimeServiceMock, formServiceMock, mockToastr, jqMock
    );
    // @ts-ignore
    newComponent.currentStaff = { branch: 'someValue' };

    newComponent.handleSelect('branch', branchPayload);

    expect(mockText).toHaveBeenCalledWith(branchPayload.name);
    expect(newComponent.branchId).toBe(branchPayload.id);

    newComponent.handleSelect('supervisor', lineManagerPayload);

    expect(newComponent.supervisorFirstName).toBe(lineManagerPayload.firstname);
    expect(newComponent.supervisorDropdown).toBe(false);
  });

  it('should create a new array with filtered content based on user"s input', () => {
    component.branches = [{ id: 2, name: 'Some branch'}];
    component.lineManagers = [{ firstname: 'John', lastname: 'Doe', email: 'email' }];
    
    component.handleInput('bra', 'branches', 'branch');
    expect(component.filteredbranches).toHaveLength(1);

    component.handleInput('em', 'lineManagers', 'supervisor');
    expect(component.filteredlineManagers).toHaveLength(1);
  });

  it('should fail if form data contain errors', () => {
    const invalidFormData = { firstname: '   ', lastname: '  ' };
    const validFormData = { firstname: 'John', lastname: 'Doe' };

    const mockToastrError = jest.spyOn(mockToastr, 'error');

    component.handleSubmit(invalidFormData, 'nameModal');

    expect(mockToastrError).toHaveBeenCalledTimes(2);
  });

  it('should successfully send update request to server', async () => {
    const validFormData = { firstname: 'John', lastname: 'Doe' };

    const mockToastrSuccess = jest.spyOn(mockToastr, 'success');
    const mockUPI = jest.spyOn(profileServiceMock, 'updatePersonalInfo');
    const mockSyncProfile = jest.spyOn(profileServiceMock, 'syncWithAPI');
    const mockSyncOvertime = jest.spyOn(overtimeServiceMock, 'syncWithAPI');
    const init = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit(validFormData, 'nameModal');

    expect(mockToastrSuccess).toHaveBeenCalledTimes(1);
    expect(mockUPI).toHaveBeenCalledTimes(1);
    expect(mockSyncProfile).toHaveBeenCalledTimes(1);
    expect(mockSyncOvertime).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('should successfully send update request to server for supervisor', async () => {
    jest.clearAllMocks()
    const validFormData = { supervisorFirstname: 'John', supervisorLastname: 'Doe', email: 'email@email.com' };

    const mockToastrSuccess = jest.spyOn(mockToastr, 'success');
    const mockULMI = jest.spyOn(profileServiceMock, 'updateLineManagerInfo');
    const mockSyncProfile = jest.spyOn(profileServiceMock, 'syncWithAPI');
    const mockSyncOvertime = jest.spyOn(overtimeServiceMock, 'syncWithAPI');
    const init = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit(validFormData, 'supervisorModal');

    expect(mockToastrSuccess).toHaveBeenCalledTimes(1);
    expect(mockULMI).toHaveBeenCalledTimes(1);
    expect(mockSyncProfile).toHaveBeenCalledTimes(1);
    expect(mockSyncOvertime).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('should successfully send image data to server', async () => {
    jest.clearAllMocks()
    component.imageFile = new Blob(['']);

    const mockToastrSuccess = jest.spyOn(mockToastr, 'success');
    const mockUI = jest.spyOn(profileServiceMock, 'updateImage');
    const mockSyncProfile = jest.spyOn(profileServiceMock, 'syncWithAPI');
    const mockSyncOvertime = jest.spyOn(overtimeServiceMock, 'syncWithAPI');
    const init = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit('validFormData', 'imageModal');

    expect(mockToastrSuccess).toHaveBeenCalledTimes(1);
    expect(mockUI).toHaveBeenCalledTimes(1);
    expect(mockSyncProfile).toHaveBeenCalledTimes(1);
    expect(mockSyncOvertime).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('should display error message if an error occurs', async () => {
    component.imageFile = new Blob(['']);

    const mockToastrError = jest.spyOn(mockToastr, 'error');
    jest.spyOn(profileServiceMock, 'updateImage').mockRejectedValueOnce('err');

    await component.handleSubmit('validFormData', 'imageModal');

    expect(mockToastrError).toHaveBeenCalledWith('An error occurred');
  });
});
