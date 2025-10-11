import { TestBed } from '@angular/core/testing';

import { ZextractErrorsService } from './zextract-errors-service';

describe('ZextractErrorsService', () => {
  let service: ZextractErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZextractErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
