import { ProfileComponent } from './profile.component';
import { authServiceMock } from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: ProfileComponent;

  beforeEach(() => {
    component = new ProfileComponent(authServiceMock);
  });

  it('should update current staff details on initialisation of component', () => {
    component.ngOnInit()
    expect(component.currentStaff.firstname).toBe('somename');
  });
});
