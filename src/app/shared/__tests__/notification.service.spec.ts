import { NotificationService } from '../notification.service';
import { httpMock, pusherMock, authServiceMock, AudioMock } from '../../__mocks__';

const response = {
  data: [
    { viewed: false, activity:  'This is some activity over thirty characters' },
    { viewed: true, activity:  'Less than thirty characters' },
  ]
}

describe('Notification Service', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService(
      httpMock, authServiceMock, pusherMock
    );
  });

  it('should initialise data', async () => {
    //@ts-ignore
    const fetchNotifsMock = jest.spyOn(service, 'fetchNotifications').mockResolvedValue(response);
    const formatDataMock = jest.spyOn(service, 'formatNotificationsData');
    const subscribeMock = jest.spyOn(pusherMock, 'subscribe');

    await service.initialiseNotificationsData();

    expect(fetchNotifsMock).toHaveBeenCalled();
    expect(formatDataMock).toHaveBeenCalled();
    expect(subscribeMock).toHaveBeenCalledWith(authServiceMock.currentStaff.staffId);
    expect(service.notifications).toHaveLength(2);
    expect(service.newNotificationsCount).toBe(1);
  });

  it('should get notifications data on other components" request', async () => {
    //@ts-ignore
    const initDataMock = jest.spyOn(service, 'initialiseNotificationsData').mockImplementation(() => {});

    await service.getNotificationsData(true);
    expect(initDataMock).toHaveBeenCalled();

    jest.clearAllMocks();
    service.notifications = [];
    
    await service.getNotificationsData(false);
    expect(initDataMock).not.toHaveBeenCalled();
  });

  it('should send a request to mark notifications as read and viewed and initialise data afterwards.', async () => {
    const httpPutMock = jest.spyOn(httpMock, 'put');
    //@ts-ignore
    const initDataMock = jest.spyOn(service, 'initialiseNotificationsData').mockImplementation(() => {});

    await service.markNotificationsAsReadAndViewed();
    expect(httpPutMock).toHaveBeenCalledWith(`${service.api}/notifications/read`, {}, service.options);
    expect(initDataMock).toHaveBeenCalled();
  });

  it('should play audio when called.', () => {
    const loadMock = jest.fn();
    const playMock = jest.fn();
    Audio.prototype.load = loadMock;
    Audio.prototype.play = playMock;

    service.playAudio('somePath');
    expect(loadMock).toHaveBeenCalled();
    expect(playMock).toHaveBeenCalled();
  });

  it('should fetchNotifications data', () => {
    const httpGetMock = jest.spyOn(httpMock, 'get');
    service.fetchNotifications();
    expect(httpGetMock).toHaveBeenCalledWith(`${service.api}/notifications`, service.options)
  })
});
