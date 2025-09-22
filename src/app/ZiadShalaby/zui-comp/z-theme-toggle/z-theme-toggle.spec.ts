import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZThemeToggle } from './z-theme-toggle';

describe('ZThemeToggle', () => {
  let component: ZThemeToggle;
  let fixture: ComponentFixture<ZThemeToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZThemeToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZThemeToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
