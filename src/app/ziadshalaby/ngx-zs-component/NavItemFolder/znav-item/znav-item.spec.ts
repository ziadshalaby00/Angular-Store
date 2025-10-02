import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZnavItem } from './znav-item';

describe('ZnavItems', () => {
  let component: ZnavItem;
  let fixture: ComponentFixture<ZnavItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZnavItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZnavItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
