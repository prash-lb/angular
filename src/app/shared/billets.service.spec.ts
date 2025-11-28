import { TestBed } from '@angular/core/testing';

import { BilletsService } from './billets.service';

describe('BilletsService', () => {
  let service: BilletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BilletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
