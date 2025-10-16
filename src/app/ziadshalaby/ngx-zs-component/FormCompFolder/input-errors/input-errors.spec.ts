import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputErrors } from './input-errors';

describe('InputErrors', () => {
  let component: InputErrors;
  let fixture: ComponentFixture<InputErrors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputErrors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputErrors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
