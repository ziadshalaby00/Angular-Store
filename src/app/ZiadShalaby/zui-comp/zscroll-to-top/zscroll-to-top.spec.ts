import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZscrollToTop } from './zscroll-to-top';

describe('ZscrollToTop', () => {
  let component: ZscrollToTop;
  let fixture: ComponentFixture<ZscrollToTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZscrollToTop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZscrollToTop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
