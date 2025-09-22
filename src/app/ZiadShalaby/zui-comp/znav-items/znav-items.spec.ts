import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZnavItems } from './znav-items';

describe('ZnavItems', () => {
  let component: ZnavItems;
  let fixture: ComponentFixture<ZnavItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZnavItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZnavItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
