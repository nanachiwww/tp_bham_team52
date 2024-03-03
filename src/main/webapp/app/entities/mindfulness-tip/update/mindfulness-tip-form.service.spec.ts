import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mindfulness-tip.test-samples';

import { MindfulnessTipFormService } from './mindfulness-tip-form.service';

describe('MindfulnessTip Form Service', () => {
  let service: MindfulnessTipFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MindfulnessTipFormService);
  });

  describe('Service methods', () => {
    describe('createMindfulnessTipFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMindfulnessTipFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
          })
        );
      });

      it('passing IMindfulnessTip should create a new form with FormGroup', () => {
        const formGroup = service.createMindfulnessTipFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
          })
        );
      });
    });

    describe('getMindfulnessTip', () => {
      it('should return NewMindfulnessTip for default MindfulnessTip initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMindfulnessTipFormGroup(sampleWithNewData);

        const mindfulnessTip = service.getMindfulnessTip(formGroup) as any;

        expect(mindfulnessTip).toMatchObject(sampleWithNewData);
      });

      it('should return NewMindfulnessTip for empty MindfulnessTip initial value', () => {
        const formGroup = service.createMindfulnessTipFormGroup();

        const mindfulnessTip = service.getMindfulnessTip(formGroup) as any;

        expect(mindfulnessTip).toMatchObject({});
      });

      it('should return IMindfulnessTip', () => {
        const formGroup = service.createMindfulnessTipFormGroup(sampleWithRequiredData);

        const mindfulnessTip = service.getMindfulnessTip(formGroup) as any;

        expect(mindfulnessTip).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMindfulnessTip should not enable id FormControl', () => {
        const formGroup = service.createMindfulnessTipFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMindfulnessTip should disable id FormControl', () => {
        const formGroup = service.createMindfulnessTipFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
