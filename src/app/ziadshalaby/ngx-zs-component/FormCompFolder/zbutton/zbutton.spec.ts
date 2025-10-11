import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zbutton } from './zbutton';

describe('Zbutton', () => {
  let component: Zbutton;
  let fixture: ComponentFixture<Zbutton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zbutton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zbutton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
