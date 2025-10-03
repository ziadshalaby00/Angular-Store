import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZthemeToggle } from './ztheme-toggle';

describe('ZthemeToggle', () => {
  let component: ZthemeToggle;
  let fixture: ComponentFixture<ZthemeToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZthemeToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZthemeToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
