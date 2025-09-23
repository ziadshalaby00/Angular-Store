import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zspinner } from './zspinner';

describe('Zspinner', () => {
  let component: Zspinner;
  let fixture: ComponentFixture<Zspinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zspinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zspinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
