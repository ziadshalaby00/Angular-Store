import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zinput } from './zinput';

describe('Zinput', () => {
  let component: Zinput;
  let fixture: ComponentFixture<Zinput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zinput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zinput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
