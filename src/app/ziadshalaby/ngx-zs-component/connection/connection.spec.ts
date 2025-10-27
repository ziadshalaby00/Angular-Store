import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Connection } from './connection';

describe('Connection', () => {
  let component: Connection;
  let fixture: ComponentFixture<Connection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Connection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
