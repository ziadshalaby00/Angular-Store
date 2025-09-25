import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zcarousel } from './zcarousel';

describe('Zcarousel', () => {
  let component: Zcarousel;
  let fixture: ComponentFixture<Zcarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zcarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zcarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
