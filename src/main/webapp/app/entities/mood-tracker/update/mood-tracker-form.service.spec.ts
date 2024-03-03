import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mood-tracker.test-samples';

import { MoodTrackerFormService } from './mood-tracker-form.service';

describe('MoodTracker Form Service', () => {
  let service: MoodTrackerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodTrackerFormService);
  });

  describe('Service methods', () => {
    describe('createMoodTrackerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMoodTrackerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            mood: expect.any(Object),
            note: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing IMoodTracker should create a new form with FormGroup', () => {
        const formGroup = service.createMoodTrackerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            mood: expect.any(Object),
            note: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getMoodTracker', () => {
      it('should return NewMoodTracker for default MoodTracker initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMoodTrackerFormGroup(sampleWithNewData);

        const moodTracker = service.getMoodTracker(formGroup) as any;

        expect(moodTracker).toMatchObject(sampleWithNewData);
      });

      it('should return NewMoodTracker for empty MoodTracker initial value', () => {
        const formGroup = service.createMoodTrackerFormGroup();

        const moodTracker = service.getMoodTracker(formGroup) as any;

        expect(moodTracker).toMatchObject({});
      });

      it('should return IMoodTracker', () => {
        const formGroup = service.createMoodTrackerFormGroup(sampleWithRequiredData);

        const moodTracker = service.getMoodTracker(formGroup) as any;

        expect(moodTracker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMoodTracker should not enable id FormControl', () => {
        const formGroup = service.createMoodTrackerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMoodTracker should disable id FormControl', () => {
        const formGroup = service.createMoodTrackerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
