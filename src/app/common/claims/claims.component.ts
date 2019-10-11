import { Component, Input, OnChanges } from '@angular/core';
import { IClaim } from '../../shared';

@Component({
  selector: 'claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnChanges {
  @Input() claims: IClaim[] = []
  @Input() statuses: string[] = [];
  @Input() isAdmin: boolean = false;
  @Input() showDetails: boolean = false;
  @Input() canModify: boolean = false;
  visibleClaims: IClaim[]
  currentPageClaims: IClaim[]
  numberOfFilteredClaims: number
  currentPage: number = 1;
  claimsPerPage: number = 5;
  totalPages: number
  activeFilter: string = 'All';

  constructor() { }

  ngOnChanges() {
    this.visibleClaims = this.claims.slice(0);
    this.calculatePagination(this.visibleClaims);
  }

  filterClaims(status) {
    this.currentPage = 1; // reset current page
    if (status === 'All') {
      this.visibleClaims = this.claims.slice(0);
    } else {
      this.visibleClaims = this.claims.filter(claim => claim.status === status);
    }
    this.calculatePagination(this.visibleClaims);
  }

  calculatePagination(claims) {    
    this.numberOfFilteredClaims = claims.length;
    this.totalPages = Math.ceil(this.numberOfFilteredClaims / this.claimsPerPage);
    
    const sliceStart = (this.currentPage - 1) * this.claimsPerPage;
    const sliceEnd = (this.currentPage * this.claimsPerPage);
    
    this.currentPageClaims = claims.slice(sliceStart, sliceEnd);
  }

  prevPage() {
    this.currentPage -= 1;
    this.calculatePagination(this.visibleClaims);
  }

  nextPage() {
    this.currentPage += 1;
    this.calculatePagination(this.visibleClaims);
  }
}
