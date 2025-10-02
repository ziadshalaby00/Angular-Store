import { TestBed } from '@angular/core/testing';

import { ZformService } from './zform-service';

describe('ZformService', () => {
  let service: ZformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
