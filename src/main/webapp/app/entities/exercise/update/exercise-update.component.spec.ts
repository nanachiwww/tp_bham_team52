import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerciseFormService } from './exercise-form.service';
import { ExerciseService } from '../service/exercise.service';
import { IExercise } from '../exercise.model';

import { ExerciseUpdateComponent } from './exercise-update.component';

describe('Exercise Management Update Component', () => {
  let comp: ExerciseUpdateComponent;
  let fixture: ComponentFixture<ExerciseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerciseFormService: ExerciseFormService;
  let exerciseService: ExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExerciseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ExerciseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerciseFormService = TestBed.inject(ExerciseFormService);
    exerciseService = TestBed.inject(ExerciseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exercise: IExercise = { id: 456 };

      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      expect(comp.exercise).toEqual(exercise);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExercise>>();
      const exercise = { id: 123 };
      jest.spyOn(exerciseFormService, 'getExercise').mockReturnValue(exercise);
      jest.spyOn(exerciseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exercise }));
      saveSubject.complete();

      // THEN
      expect(exerciseFormService.getExercise).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerciseService.update).toHaveBeenCalledWith(expect.objectContaining(exercise));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExercise>>();
      const exercise = { id: 123 };
      jest.spyOn(exerciseFormService, 'getExercise').mockReturnValue({ id: null });
      jest.spyOn(exerciseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercise: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exercise }));
      saveSubject.complete();

      // THEN
      expect(exerciseFormService.getExercise).toHaveBeenCalled();
      expect(exerciseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExercise>>();
      const exercise = { id: 123 };
      jest.spyOn(exerciseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerciseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
