import { TestBed } from '@angular/core/testing';

import { ZformCompService } from './zform-comp-service';

describe('ZformCompService', () => {
  let service: ZformCompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZformCompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
