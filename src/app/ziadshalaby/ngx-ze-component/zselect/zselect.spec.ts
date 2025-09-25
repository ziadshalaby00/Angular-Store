import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zselect } from './zselect';

describe('Zselect', () => {
  let component: Zselect;
  let fixture: ComponentFixture<Zselect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zselect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zselect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
