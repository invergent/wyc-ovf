import { LineManagerService } from "./line-manager.service";
import { httpMock } from "../__mocks__";


describe('Line Manger Service', () => {
  let service: LineManagerService;

  beforeEach(() => {
    service = new LineManagerService(httpMock);
  });

  it('should fetch claims to approve', () => {
    const httpGet = jest.spyOn(httpMock, 'get');
    const httpPut = jest.spyOn(httpMock, 'put');

    service.fetchClaimsToApprove();
    service.runApproval('approvalType', 1);
    service.verifyLineManager('someHash');

    expect(httpGet).toHaveBeenCalledTimes(2);
    expect(httpPut).toHaveBeenCalledTimes(1);
  });
});
