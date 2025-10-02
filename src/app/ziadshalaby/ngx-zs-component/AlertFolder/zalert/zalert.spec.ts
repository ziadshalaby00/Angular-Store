import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zalert } from './zalert';

describe('Zalert', () => {
  let component: Zalert;
  let fixture: ComponentFixture<Zalert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zalert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zalert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
