import { TestBed } from '@angular/core/testing';

import { Zform } from './zform-service';

describe('Zform', () => {
  let service: Zform<{'null': null}>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Zform);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
