import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../stress-tracker.test-samples';

import { StressTrackerFormService } from './stress-tracker-form.service';

describe('StressTracker Form Service', () => {
  let service: StressTrackerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StressTrackerFormService);
  });

  describe('Service methods', () => {
    describe('createStressTrackerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStressTrackerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            level: expect.any(Object),
            note: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing IStressTracker should create a new form with FormGroup', () => {
        const formGroup = service.createStressTrackerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            level: expect.any(Object),
            note: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getStressTracker', () => {
      it('should return NewStressTracker for default StressTracker initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStressTrackerFormGroup(sampleWithNewData);

        const stressTracker = service.getStressTracker(formGroup) as any;

        expect(stressTracker).toMatchObject(sampleWithNewData);
      });

      it('should return NewStressTracker for empty StressTracker initial value', () => {
        const formGroup = service.createStressTrackerFormGroup();

        const stressTracker = service.getStressTracker(formGroup) as any;

        expect(stressTracker).toMatchObject({});
      });

      it('should return IStressTracker', () => {
        const formGroup = service.createStressTrackerFormGroup(sampleWithRequiredData);

        const stressTracker = service.getStressTracker(formGroup) as any;

        expect(stressTracker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStressTracker should not enable id FormControl', () => {
        const formGroup = service.createStressTrackerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStressTracker should disable id FormControl', () => {
        const formGroup = service.createStressTrackerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
