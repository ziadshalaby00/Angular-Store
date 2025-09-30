import { TestBed } from '@angular/core/testing';
import { ConfigTypeAndCls } from './configTypeAndCls';

describe('ConfigTypeAndCls', () => {
  let service: ConfigTypeAndCls;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigTypeAndCls);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
