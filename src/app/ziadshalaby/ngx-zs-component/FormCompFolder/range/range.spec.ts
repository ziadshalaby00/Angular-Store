import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Range } from './range';

describe('Range', () => {
  let component: Range;
  let fixture: ComponentFixture<Range>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Range]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Range);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
