import { ProfileComponent } from './profile.component';
import {
  authServiceMock, profileServiceMock, formServiceMock, mockToastr, mockJQuery, overtimeServiceMock, notificationServiceMock, routerMock, activatedRouteMock, profileCheckerServiceMock
} from '../../__mocks__';
import { FormSubmissionService, ProfileCheckerService } from 'src/app/shared';

const realFSS = new FormSubmissionService();

describe('Profile Component', () => {
  let component: ProfileComponent;

  beforeEach(() => {
    component = new ProfileComponent(
      authServiceMock, notificationServiceMock, profileCheckerServiceMock,  profileServiceMock, overtimeServiceMock,
      realFSS,activatedRouteMock, routerMock, mockToastr, mockJQuery
    );
  });

  it('should update current staff details on initialisation of component', async () => {
    const profileMock = jest.spyOn(profileServiceMock, 'fetchProfileData');

    await component.ngOnInit();

    expect(profileMock).toHaveBeenCalled();
    expect(component.currentStaff.firstname).toBe('somename');
  });

  it('should display flash message and add listener for clicks', () => {
    component.ngAfterViewInit();

    expect(component.firstTimeLogin).toBe('value');
    expect(component.autoDisplay).toBe(true);
  });

  it('should close flash message and display message to lead user to next step.', () => {
    component.autoDisplay = true;
    component.closeFlashMessage();

    expect(component.autoDisplay).toBe(false);
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
      authServiceMock, notificationServiceMock, profileCheckerServiceMock,  profileServiceMock, overtimeServiceMock,
      realFSS, routerMock, activatedRouteMock, mockToastr, jqMock
    );
    newComponent.triggerFileInput();

    expect(mockClick).toHaveBeenCalled();
  });

  it('should toggle edit mode', () => {
    const mockCss = jest.fn();
    const jqMock = jest.fn(() => ({ css: mockCss }));
    const newComponent = new ProfileComponent(
      authServiceMock, notificationServiceMock, profileCheckerServiceMock,  profileServiceMock, overtimeServiceMock,
      realFSS, routerMock, activatedRouteMock, mockToastr, jqMock
    );
    expect(newComponent.editMode).toBe('none');

    newComponent.toggleEditMode();

    expect(newComponent.editMode).toBe('block');
    expect(mockCss).toHaveBeenCalledTimes(5);

    newComponent.toggleEditMode();

    expect(newComponent.editMode).toBe('none');
    expect(mockCss).toHaveBeenCalledTimes(10);
  });

  it('should update open modal"s input fields on dropdown item select', () => {
    const mockText = jest.fn();
    const jqMock = jest.fn(() => ({ text: mockText }));
    const branchPayload = { id: 1, name: 'name' };
    const lineManagerPayload = { firstname: 'John', lastname: 'Doe', email: 'email' };

    const newComponent = new ProfileComponent(
      authServiceMock, notificationServiceMock, profileCheckerServiceMock,  profileServiceMock, overtimeServiceMock,
      realFSS, routerMock, activatedRouteMock, mockToastr, jqMock
    );
    // @ts-ignore
    newComponent.currentStaff = { branch: 'someValue' };

    newComponent.handleSelect('branch', branchPayload);

    expect(mockText).toHaveBeenCalledWith(branchPayload.name);
    expect(newComponent.branchId).toBe(branchPayload.id);

    newComponent.handleSelect('lineManager', lineManagerPayload);

    expect(newComponent.lineManagerFirstName).toBe(lineManagerPayload.firstname);
    expect(newComponent.lineManagerDropdown).toBe(false);
  });

  it('should create a new array with filtered content based on user"s input', () => {
    // @ts-ignore
    component.branches = [{ id: 2, name: 'Some branch'}];
    component.lineManagers = [{ firstname: 'John', lastname: 'Doe', email: 'email' }];
    
    component.handleInput('bra', 'branches', 'branch');
    expect(component.filteredbranches).toHaveLength(1);

    component.handleInput('em', 'lineManagers', 'supervisor');
    expect(component.filteredlineManagers).toHaveLength(1);
  });

  it('should fail if form data contain errors', () => {
    const invalidFormData = { firstname: '   ', lastname: '  ' };

    const mockToastrError = jest.spyOn(mockToastr, 'error');

    component.handleSubmit(invalidFormData, 'nameModal');

    expect(mockToastrError).toHaveBeenCalledTimes(2);
  });

  it('should successfully send update request to server', async () => {
    const validFormData = { firstname: 'John', lastname: 'Doe' };

    const mockToastrSuccess = jest.spyOn(mockToastr, 'success');
    const mockUPI = jest.spyOn(profileServiceMock, 'updatePersonalInfo');
    const mockSyncAuth = jest.spyOn(authServiceMock, 'syncWithAPI');
    const mockSyncProfile = jest.spyOn(profileServiceMock, 'syncWithAPI');
    const mockSyncOvertime = jest.spyOn(overtimeServiceMock, 'syncWithAPI');
    const init = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit(validFormData, 'nameModal');

    expect(mockToastrSuccess).toHaveBeenCalledTimes(1);
    expect(mockUPI).toHaveBeenCalledTimes(1);
    expect(mockSyncAuth).toHaveBeenCalledTimes(1);
    expect(mockSyncProfile).toHaveBeenCalledTimes(1);
    expect(mockSyncOvertime).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('should successfully send update request to server for line Manager', async () => {
    jest.clearAllMocks()
    const validFormData = { lineManagerFirstname: 'John', lineManagerLastname: 'Doe', email: 'email@email.com' };

    const mockToastrSuccess = jest.spyOn(mockToastr, 'success');
    const mockULMI = jest.spyOn(profileServiceMock, 'updateLineManagerInfo');
    const mockSyncProfile = jest.spyOn(profileServiceMock, 'syncWithAPI');
    const mockSyncOvertime = jest.spyOn(overtimeServiceMock, 'syncWithAPI');
    const init = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit(validFormData, 'lineManagerModal');

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

  it('should set image file property and handle image preview', () => {
    const payload = { value: 'value', files: [{ filename: 'filename' }] };
    const mockListener = jest.fn();
    const mockReader = jest.fn();
    FileReader.prototype.addEventListener = mockListener;
    FileReader.prototype.readAsDataURL = mockReader;
    component.handleImagePreview(payload);

    expect(component.imageFile).toHaveProperty('filename');
    expect(mockListener).toHaveBeenCalled();
    expect(mockReader).toHaveBeenCalled();
  })
});
