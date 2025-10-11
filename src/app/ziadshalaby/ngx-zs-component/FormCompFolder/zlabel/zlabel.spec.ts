import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zlabel } from './zlabel';

describe('Zlabel', () => {
  let component: Zlabel;
  let fixture: ComponentFixture<Zlabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zlabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zlabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
