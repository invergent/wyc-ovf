import { EnforceProfileUpdateService } from "../enforce-profile-update.service";
import { routerMock, profileCheckerServiceMock } from "src/app/__mocks__";

describe('Enforce profile update guard', () => {
  let service: EnforceProfileUpdateService;

  beforeEach(() => {
    service = new EnforceProfileUpdateService(routerMock, profileCheckerServiceMock);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });
});
