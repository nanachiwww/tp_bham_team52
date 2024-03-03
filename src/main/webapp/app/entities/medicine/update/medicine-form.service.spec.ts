import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../medicine.test-samples';

import { MedicineFormService } from './medicine-form.service';

describe('Medicine Form Service', () => {
  let service: MedicineFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicineFormService);
  });

  describe('Service methods', () => {
    describe('createMedicineFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMedicineFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            subjectiveEffect: expect.any(Object),
            supplementType: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing IMedicine should create a new form with FormGroup', () => {
        const formGroup = service.createMedicineFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            subjectiveEffect: expect.any(Object),
            supplementType: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getMedicine', () => {
      it('should return NewMedicine for default Medicine initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMedicineFormGroup(sampleWithNewData);

        const medicine = service.getMedicine(formGroup) as any;

        expect(medicine).toMatchObject(sampleWithNewData);
      });

      it('should return NewMedicine for empty Medicine initial value', () => {
        const formGroup = service.createMedicineFormGroup();

        const medicine = service.getMedicine(formGroup) as any;

        expect(medicine).toMatchObject({});
      });

      it('should return IMedicine', () => {
        const formGroup = service.createMedicineFormGroup(sampleWithRequiredData);

        const medicine = service.getMedicine(formGroup) as any;

        expect(medicine).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMedicine should not enable id FormControl', () => {
        const formGroup = service.createMedicineFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMedicine should disable id FormControl', () => {
        const formGroup = service.createMedicineFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
