import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sleep-record.test-samples';

import { SleepRecordFormService } from './sleep-record-form.service';

describe('SleepRecord Form Service', () => {
  let service: SleepRecordFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SleepRecordFormService);
  });

  describe('Service methods', () => {
    describe('createSleepRecordFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSleepRecordFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            rating: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing ISleepRecord should create a new form with FormGroup', () => {
        const formGroup = service.createSleepRecordFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            rating: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getSleepRecord', () => {
      it('should return NewSleepRecord for default SleepRecord initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSleepRecordFormGroup(sampleWithNewData);

        const sleepRecord = service.getSleepRecord(formGroup) as any;

        expect(sleepRecord).toMatchObject(sampleWithNewData);
      });

      it('should return NewSleepRecord for empty SleepRecord initial value', () => {
        const formGroup = service.createSleepRecordFormGroup();

        const sleepRecord = service.getSleepRecord(formGroup) as any;

        expect(sleepRecord).toMatchObject({});
      });

      it('should return ISleepRecord', () => {
        const formGroup = service.createSleepRecordFormGroup(sampleWithRequiredData);

        const sleepRecord = service.getSleepRecord(formGroup) as any;

        expect(sleepRecord).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISleepRecord should not enable id FormControl', () => {
        const formGroup = service.createSleepRecordFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSleepRecord should disable id FormControl', () => {
        const formGroup = service.createSleepRecordFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
