import { TestBed } from '@angular/core/testing';

import { ZalertService } from './zalert-service';

describe('ZalertService', () => {
  let service: ZalertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZalertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
