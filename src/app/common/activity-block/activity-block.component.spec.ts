import { ActivityBlock } from './activity-block.component';
import {
  authenticatorMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: ActivityBlock;

  beforeEach(() => {
    component = new ActivityBlock();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
