import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionbarComponent } from './sectionbar.component';

describe('SectionbarComponent', () => {
  let component: SectionbarComponent;
  let fixture: ComponentFixture<SectionbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
