import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExerciseDetailComponent } from './exercise-detail.component';

describe('Exercise Management Detail Component', () => {
  let comp: ExerciseDetailComponent;
  let fixture: ComponentFixture<ExerciseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ exercise: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExerciseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExerciseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load exercise on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.exercise).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
