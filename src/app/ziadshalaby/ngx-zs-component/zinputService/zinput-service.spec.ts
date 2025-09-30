import { TestBed } from '@angular/core/testing';

import { ZinputService } from './zinput-service';

describe('ZinputService', () => {
  let service: ZinputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZinputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
