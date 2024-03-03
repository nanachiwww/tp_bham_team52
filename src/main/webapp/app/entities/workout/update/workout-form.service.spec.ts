import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../workout.test-samples';

import { WorkoutFormService } from './workout-form.service';

describe('Workout Form Service', () => {
  let service: WorkoutFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutFormService);
  });

  describe('Service methods', () => {
    describe('createWorkoutFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWorkoutFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            duration: expect.any(Object),
            intensityLevel: expect.any(Object),
            exercises: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing IWorkout should create a new form with FormGroup', () => {
        const formGroup = service.createWorkoutFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            duration: expect.any(Object),
            intensityLevel: expect.any(Object),
            exercises: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getWorkout', () => {
      it('should return NewWorkout for default Workout initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWorkoutFormGroup(sampleWithNewData);

        const workout = service.getWorkout(formGroup) as any;

        expect(workout).toMatchObject(sampleWithNewData);
      });

      it('should return NewWorkout for empty Workout initial value', () => {
        const formGroup = service.createWorkoutFormGroup();

        const workout = service.getWorkout(formGroup) as any;

        expect(workout).toMatchObject({});
      });

      it('should return IWorkout', () => {
        const formGroup = service.createWorkoutFormGroup(sampleWithRequiredData);

        const workout = service.getWorkout(formGroup) as any;

        expect(workout).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWorkout should not enable id FormControl', () => {
        const formGroup = service.createWorkoutFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWorkout should disable id FormControl', () => {
        const formGroup = service.createWorkoutFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
