import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Znavbar } from './znavbar';

describe('Znavbar', () => {
  let component: Znavbar;
  let fixture: ComponentFixture<Znavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Znavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Znavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
