import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mindfulness-practice.test-samples';

import { MindfulnessPracticeFormService } from './mindfulness-practice-form.service';

describe('MindfulnessPractice Form Service', () => {
  let service: MindfulnessPracticeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MindfulnessPracticeFormService);
  });

  describe('Service methods', () => {
    describe('createMindfulnessPracticeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMindfulnessPracticeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            activityType: expect.any(Object),
            duration: expect.any(Object),
            note: expect.any(Object),
            mindfulnessTip: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing IMindfulnessPractice should create a new form with FormGroup', () => {
        const formGroup = service.createMindfulnessPracticeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            activityType: expect.any(Object),
            duration: expect.any(Object),
            note: expect.any(Object),
            mindfulnessTip: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getMindfulnessPractice', () => {
      it('should return NewMindfulnessPractice for default MindfulnessPractice initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMindfulnessPracticeFormGroup(sampleWithNewData);

        const mindfulnessPractice = service.getMindfulnessPractice(formGroup) as any;

        expect(mindfulnessPractice).toMatchObject(sampleWithNewData);
      });

      it('should return NewMindfulnessPractice for empty MindfulnessPractice initial value', () => {
        const formGroup = service.createMindfulnessPracticeFormGroup();

        const mindfulnessPractice = service.getMindfulnessPractice(formGroup) as any;

        expect(mindfulnessPractice).toMatchObject({});
      });

      it('should return IMindfulnessPractice', () => {
        const formGroup = service.createMindfulnessPracticeFormGroup(sampleWithRequiredData);

        const mindfulnessPractice = service.getMindfulnessPractice(formGroup) as any;

        expect(mindfulnessPractice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMindfulnessPractice should not enable id FormControl', () => {
        const formGroup = service.createMindfulnessPracticeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMindfulnessPractice should disable id FormControl', () => {
        const formGroup = service.createMindfulnessPracticeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
