import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zpagination } from './zpagination';

describe('Zpagination', () => {
  let component: Zpagination;
  let fixture: ComponentFixture<Zpagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zpagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zpagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
