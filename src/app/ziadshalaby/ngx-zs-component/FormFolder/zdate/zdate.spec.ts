import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zdate } from './zdate';

describe('Zdate', () => {
  let component: Zdate;
  let fixture: ComponentFixture<Zdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
