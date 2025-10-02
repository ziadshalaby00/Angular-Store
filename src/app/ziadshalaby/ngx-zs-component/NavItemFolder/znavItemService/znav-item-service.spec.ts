import { TestBed } from '@angular/core/testing';

import { ZnavItemService } from './znav-item-service';

describe('ZnavItemService', () => {
  let service: ZnavItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZnavItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
