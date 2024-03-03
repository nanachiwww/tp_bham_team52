import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../compare-result.test-samples';

import { CompareResultFormService } from './compare-result-form.service';

describe('CompareResult Form Service', () => {
  let service: CompareResultFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareResultFormService);
  });

  describe('Service methods', () => {
    describe('createCompareResultFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompareResultFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            resultDetails: expect.any(Object),
            timestamp: expect.any(Object),
            dietaryGoalComplete: expect.any(Object),
            moodGoalAchieved: expect.any(Object),
            workoutGoalAchieved: expect.any(Object),
            sleepGoalAchieved: expect.any(Object),
          })
        );
      });

      it('passing ICompareResult should create a new form with FormGroup', () => {
        const formGroup = service.createCompareResultFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            resultDetails: expect.any(Object),
            timestamp: expect.any(Object),
            dietaryGoalComplete: expect.any(Object),
            moodGoalAchieved: expect.any(Object),
            workoutGoalAchieved: expect.any(Object),
            sleepGoalAchieved: expect.any(Object),
          })
        );
      });
    });

    describe('getCompareResult', () => {
      it('should return NewCompareResult for default CompareResult initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompareResultFormGroup(sampleWithNewData);

        const compareResult = service.getCompareResult(formGroup) as any;

        expect(compareResult).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompareResult for empty CompareResult initial value', () => {
        const formGroup = service.createCompareResultFormGroup();

        const compareResult = service.getCompareResult(formGroup) as any;

        expect(compareResult).toMatchObject({});
      });

      it('should return ICompareResult', () => {
        const formGroup = service.createCompareResultFormGroup(sampleWithRequiredData);

        const compareResult = service.getCompareResult(formGroup) as any;

        expect(compareResult).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompareResult should not enable id FormControl', () => {
        const formGroup = service.createCompareResultFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompareResult should disable id FormControl', () => {
        const formGroup = service.createCompareResultFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
