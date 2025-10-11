import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zmodal } from './zmodal';

describe('Zmodal', () => {
  let component: Zmodal;
  let fixture: ComponentFixture<Zmodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zmodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zmodal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
