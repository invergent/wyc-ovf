import { AdminProfileComponent } from './admin-profile.component';
import { authServiceMock, profileServiceMock, overtimeServiceMock, mockToastr, mockJQuery } from 'src/app/__mocks__';
import { FormSubmissionService } from 'src/app/shared';

describe('AdminProfileComponent', () => {
  let component: AdminProfileComponent;
  const rfss = new FormSubmissionService();

  beforeEach(() => {
    component = new AdminProfileComponent(authServiceMock, profileServiceMock, rfss, mockToastr, mockJQuery);
  });

  it('should update current staff details on initialisation of component', async () => {
    await component.ngOnInit();
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
    const newComponent = new AdminProfileComponent(
      authServiceMock, profileServiceMock, rfss, mockToastr, jqMock
    );
    newComponent.triggerFileInput();

    expect(mockClick).toHaveBeenCalled();
  });

  it('should toggle edit mode', () => {
    const mockCss = jest.fn();
    const jqMock = jest.fn(() => ({ css: mockCss }));
    const newComponent = new AdminProfileComponent(
      authServiceMock, profileServiceMock, rfss, mockToastr, jqMock
    );
    expect(newComponent.editMode).toBe('none');

    newComponent.toggleEditMode();

    expect(newComponent.editMode).toBe('block');
    expect(mockCss).toHaveBeenCalledTimes(5);

    newComponent.toggleEditMode();

    expect(newComponent.editMode).toBe('none');
    expect(mockCss).toHaveBeenCalledTimes(10);
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
    const mockSyncAuth = jest.spyOn(authServiceMock, 'syncWithAPI');
    const init = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit(validFormData, 'nameModal');

    expect(mockToastrSuccess).toHaveBeenCalledTimes(1);
    expect(mockSyncAuth).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('should successfully send image data to server', async () => {
    jest.clearAllMocks()
    component.imageFile = new Blob(['']);

    const mockToastrSuccess = jest.spyOn(mockToastr, 'success');
    const mockUI = jest.spyOn(profileServiceMock, 'updateImage');
    const init = jest.spyOn(component, 'initialiseData');

    await component.handleSubmit('validFormData', 'imageModal');

    expect(mockToastrSuccess).toHaveBeenCalledTimes(1);
    expect(mockUI).toHaveBeenCalledTimes(1);
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
