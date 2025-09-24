import { TestBed } from '@angular/core/testing';

import { ZnavItemsService } from './znav-items-service';

describe('ZnavItemsService', () => {
  let service: ZnavItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZnavItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
