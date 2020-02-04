import { AdminOnlyGuard } from '../index';
import { routerMock, authServiceMock } from '../../__mocks__';

describe('Admin Only Guard', () => {
  let guard: AdminOnlyGuard;

  beforeEach(() => {
    guard = new AdminOnlyGuard(routerMock, authServiceMock);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });
});

