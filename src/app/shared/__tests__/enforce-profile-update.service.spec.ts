import { EnforceProfileUpdateService } from "../enforce-profile-update.service";
import { routerMock, profileCheckerServiceMock } from "src/app/__mocks__";

describe('Enforce profile update guard', () => {
  let service: EnforceProfileUpdateService;

  beforeEach(() => {
    service = new EnforceProfileUpdateService(routerMock, profileCheckerServiceMock);
  });
  
  it('should redirect to change-password page if staff is logging in for the first time', () => {
    const profileCheckerMock3 = jest.spyOn(profileCheckerServiceMock, 'getPendingFields');

    const result = service.canActivate();
    
    expect(profileCheckerMock3).toHaveBeenCalled();
    expect(result).toBe(true);

    const profileCheckerMock = jest.spyOn(profileCheckerServiceMock, 'getPendingFields').mockReturnValue(['changedPassword']);
    const routerNavMock = jest.spyOn(routerMock, 'navigate');

    service.canActivate();

    expect(profileCheckerMock).toHaveBeenCalled();
    expect(routerNavMock).toHaveBeenCalledWith(['/staff/change-password'], { queryParams: { m: 'p' } });

    const profileCheckerMock2 = jest.spyOn(profileCheckerServiceMock, 'getPendingFields').mockReturnValue(['something']);

    service.canActivate();

    expect(profileCheckerMock2).toHaveBeenCalled();
    expect(routerNavMock).toHaveBeenCalledWith(['/staff/profile'], { queryParams: { m: 'lm' } });
  });
});
