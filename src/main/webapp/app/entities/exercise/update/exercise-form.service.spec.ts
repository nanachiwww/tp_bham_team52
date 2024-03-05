import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../exercise.test-samples';

import { ExerciseFormService } from './exercise-form.service';

describe('Exercise Form Service', () => {
  let service: ExerciseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseFormService);
  });

  describe('Service methods', () => {
    describe('createExerciseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExerciseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            reps: expect.any(Object),
            sets: expect.any(Object),
            muscleGroup: expect.any(Object),
          })
        );
      });

      it('passing IExercise should create a new form with FormGroup', () => {
        const formGroup = service.createExerciseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            reps: expect.any(Object),
            sets: expect.any(Object),
            muscleGroup: expect.any(Object),
          })
        );
      });
    });

    describe('getExercise', () => {
      it('should return NewExercise for default Exercise initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createExerciseFormGroup(sampleWithNewData);

        const exercise = service.getExercise(formGroup) as any;

        expect(exercise).toMatchObject(sampleWithNewData);
      });

      it('should return NewExercise for empty Exercise initial value', () => {
        const formGroup = service.createExerciseFormGroup();

        const exercise = service.getExercise(formGroup) as any;

        expect(exercise).toMatchObject({});
      });

      it('should return IExercise', () => {
        const formGroup = service.createExerciseFormGroup(sampleWithRequiredData);

        const exercise = service.getExercise(formGroup) as any;

        expect(exercise).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExercise should not enable id FormControl', () => {
        const formGroup = service.createExerciseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExercise should disable id FormControl', () => {
        const formGroup = service.createExerciseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
