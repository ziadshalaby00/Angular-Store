import { TestBed } from '@angular/core/testing';

import { Form } from './form-service';

describe('Form', () => {
  let service: Form<{'null': null}>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Form);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
