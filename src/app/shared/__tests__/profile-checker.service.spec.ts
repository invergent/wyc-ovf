import { ProfileCheckerService } from "../profile-checker.service";
import { authServiceMock } from "src/app/__mocks__";

describe('ProfileCheckerService', () => {
  let service: ProfileCheckerService;

  beforeEach(() => {
    service = new ProfileCheckerService(authServiceMock);
  });

  it('should return an array of string representing the names of pending fields', () => {
    const pendingFields = service.getPendingFields();
    expect(pendingFields).toHaveLength(5);
  })
})