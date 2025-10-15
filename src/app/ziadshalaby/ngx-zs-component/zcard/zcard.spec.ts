import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zcard } from './zcard';

describe('Zcard', () => {
  let component: Zcard;
  let fixture: ComponentFixture<Zcard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zcard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zcard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
