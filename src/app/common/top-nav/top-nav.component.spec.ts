import { TopNav } from './top-nav.component';
import {
  authServiceMock, overtimeServiceMock, mockJQuery, notificationServiceMock, changeDetectorMock
} from '../../__mocks__';

jest.useFakeTimers();

describe('Comfirm password reset', () => {
  let component: TopNav;

  beforeEach(() => {
    component = new TopNav(
      authServiceMock, notificationServiceMock, overtimeServiceMock, changeDetectorMock, mockJQuery
    );
  });

  it('should initialise notifications data', async () => {
    const init = jest.spyOn(component, 'initialiseNotifications');
    const bindMock = jest.spyOn(notificationServiceMock.channel, 'bind_global');
    await component.ngOnInit();
    expect(init).toHaveBeenCalled();
    expect(bindMock).toHaveBeenCalled();
  });

  it('should display realtime message, sync overtime data with api, detect changes and initialise data', async () => {
    const payload = { message: 'mock message' };
    const init = jest.spyOn(component, 'initialiseNotifications');
    const tfmMock = jest.spyOn(component, 'toggleFlashMessage');
    const mockSyncOT = jest.spyOn(overtimeServiceMock, 'syncWithAPI');
    const cdMock = jest.spyOn(changeDetectorMock, 'detectChanges');

    await component.notificationEventHandler('event', payload);
    jest.runAllTimers();

    expect(init).toHaveBeenCalled();
    expect(mockSyncOT).toHaveBeenCalled();
    expect(cdMock).toHaveBeenCalled();
    expect(tfmMock).toHaveBeenCalledWith(payload.message);

    await component.notificationEventHandler('event', {});
  });

  it('should emit an event', () => {
    const emitMethod = jest.spyOn(component.sideNavToggleEvent, 'emit');
    component.toggleSideNav();
    expect(emitMethod).toHaveBeenCalled();
  });
});
