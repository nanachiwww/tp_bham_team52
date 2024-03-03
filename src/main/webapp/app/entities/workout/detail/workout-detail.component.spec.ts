import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WorkoutDetailComponent } from './workout-detail.component';

describe('Workout Management Detail Component', () => {
  let comp: WorkoutDetailComponent;
  let fixture: ComponentFixture<WorkoutDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ workout: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WorkoutDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WorkoutDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load workout on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.workout).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
