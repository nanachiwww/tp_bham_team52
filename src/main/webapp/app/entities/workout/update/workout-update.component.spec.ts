import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WorkoutFormService } from './workout-form.service';
import { WorkoutService } from '../service/workout.service';
import { IWorkout } from '../workout.model';
import { IExercise } from 'app/entities/exercise/exercise.model';
import { ExerciseService } from 'app/entities/exercise/service/exercise.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { WorkoutUpdateComponent } from './workout-update.component';

describe('Workout Management Update Component', () => {
  let comp: WorkoutUpdateComponent;
  let fixture: ComponentFixture<WorkoutUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let workoutFormService: WorkoutFormService;
  let workoutService: WorkoutService;
  let exerciseService: ExerciseService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WorkoutUpdateComponent],
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
      .overrideTemplate(WorkoutUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    workoutFormService = TestBed.inject(WorkoutFormService);
    workoutService = TestBed.inject(WorkoutService);
    exerciseService = TestBed.inject(ExerciseService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Exercise query and add missing value', () => {
      const workout: IWorkout = { id: 456 };
      const exercises: IExercise[] = [{ id: 44002 }];
      workout.exercises = exercises;

      const exerciseCollection: IExercise[] = [{ id: 59196 }];
      jest.spyOn(exerciseService, 'query').mockReturnValue(of(new HttpResponse({ body: exerciseCollection })));
      const additionalExercises = [...exercises];
      const expectedCollection: IExercise[] = [...additionalExercises, ...exerciseCollection];
      jest.spyOn(exerciseService, 'addExerciseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      expect(exerciseService.query).toHaveBeenCalled();
      expect(exerciseService.addExerciseToCollectionIfMissing).toHaveBeenCalledWith(
        exerciseCollection,
        ...additionalExercises.map(expect.objectContaining)
      );
      expect(comp.exercisesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const workout: IWorkout = { id: 456 };
      const userProfile: IUserProfile = { id: 30225 };
      workout.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 9629 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const workout: IWorkout = { id: 456 };
      const exercises: IExercise = { id: 34605 };
      workout.exercises = [exercises];
      const userProfile: IUserProfile = { id: 64320 };
      workout.userProfile = userProfile;

      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      expect(comp.exercisesSharedCollection).toContain(exercises);
      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.workout).toEqual(workout);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkout>>();
      const workout = { id: 123 };
      jest.spyOn(workoutFormService, 'getWorkout').mockReturnValue(workout);
      jest.spyOn(workoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workout }));
      saveSubject.complete();

      // THEN
      expect(workoutFormService.getWorkout).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(workoutService.update).toHaveBeenCalledWith(expect.objectContaining(workout));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkout>>();
      const workout = { id: 123 };
      jest.spyOn(workoutFormService, 'getWorkout').mockReturnValue({ id: null });
      jest.spyOn(workoutService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workout: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workout }));
      saveSubject.complete();

      // THEN
      expect(workoutFormService.getWorkout).toHaveBeenCalled();
      expect(workoutService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkout>>();
      const workout = { id: 123 };
      jest.spyOn(workoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(workoutService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareExercise', () => {
      it('Should forward to exerciseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(exerciseService, 'compareExercise');
        comp.compareExercise(entity, entity2);
        expect(exerciseService.compareExercise).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
