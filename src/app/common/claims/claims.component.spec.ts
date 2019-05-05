import { ClaimsComponent } from './claims.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Claim', () => {
  let component: ClaimsComponent;

  beforeEach(() => {
    component = new ClaimsComponent();
    //@ts-ignore
    component.claims = [{ status: 'Cancelled'}, { status: 'Declined'}, { status: 'Completed'}, { status: 'Processing'}]
  });

  it('should perform pagination calculation and update variables', () => {
    component.ngOnChanges();

    expect(component.visibleClaims).toHaveLength(4);
    expect(component.numberOfFilteredClaims).toBe(4);
    expect(component.totalPages).toBe(1);
    expect(component.currentPageClaims).toHaveLength(4);
  });

  it('should perform filter on claims array', () => {
    component.filterClaims('Cancelled');

    expect(component.visibleClaims).toHaveLength(1);
    expect(component.numberOfFilteredClaims).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.currentPageClaims).toHaveLength(1);

    component.filterClaims('All');

    expect(component.visibleClaims).toHaveLength(4);
    expect(component.numberOfFilteredClaims).toBe(4);
    expect(component.totalPages).toBe(1);
    expect(component.currentPageClaims).toHaveLength(4);
  });

  it('should increment or decrement currentPage value', () => {
    component.ngOnChanges();
    component.nextPage();

    expect(component.currentPage).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });
});
