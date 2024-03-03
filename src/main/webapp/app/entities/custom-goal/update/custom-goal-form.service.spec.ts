import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../custom-goal.test-samples';

import { CustomGoalFormService } from './custom-goal-form.service';

describe('CustomGoal Form Service', () => {
  let service: CustomGoalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomGoalFormService);
  });

  describe('Service methods', () => {
    describe('createCustomGoalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCustomGoalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing ICustomGoal should create a new form with FormGroup', () => {
        const formGroup = service.createCustomGoalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getCustomGoal', () => {
      it('should return NewCustomGoal for default CustomGoal initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCustomGoalFormGroup(sampleWithNewData);

        const customGoal = service.getCustomGoal(formGroup) as any;

        expect(customGoal).toMatchObject(sampleWithNewData);
      });

      it('should return NewCustomGoal for empty CustomGoal initial value', () => {
        const formGroup = service.createCustomGoalFormGroup();

        const customGoal = service.getCustomGoal(formGroup) as any;

        expect(customGoal).toMatchObject({});
      });

      it('should return ICustomGoal', () => {
        const formGroup = service.createCustomGoalFormGroup(sampleWithRequiredData);

        const customGoal = service.getCustomGoal(formGroup) as any;

        expect(customGoal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICustomGoal should not enable id FormControl', () => {
        const formGroup = service.createCustomGoalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCustomGoal should disable id FormControl', () => {
        const formGroup = service.createCustomGoalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
