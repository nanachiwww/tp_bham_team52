import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../energy-intake-result.test-samples';

import { EnergyIntakeResultFormService } from './energy-intake-result-form.service';

describe('EnergyIntakeResult Form Service', () => {
  let service: EnergyIntakeResultFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnergyIntakeResultFormService);
  });

  describe('Service methods', () => {
    describe('createEnergyIntakeResultFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEnergyIntakeResultFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            goalComplete: expect.any(Object),
            details: expect.any(Object),
            date: expect.any(Object),
            userProfile: expect.any(Object),
            items: expect.any(Object),
          })
        );
      });

      it('passing IEnergyIntakeResult should create a new form with FormGroup', () => {
        const formGroup = service.createEnergyIntakeResultFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            goalComplete: expect.any(Object),
            details: expect.any(Object),
            date: expect.any(Object),
            userProfile: expect.any(Object),
            items: expect.any(Object),
          })
        );
      });
    });

    describe('getEnergyIntakeResult', () => {
      it('should return NewEnergyIntakeResult for default EnergyIntakeResult initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEnergyIntakeResultFormGroup(sampleWithNewData);

        const energyIntakeResult = service.getEnergyIntakeResult(formGroup) as any;

        expect(energyIntakeResult).toMatchObject(sampleWithNewData);
      });

      it('should return NewEnergyIntakeResult for empty EnergyIntakeResult initial value', () => {
        const formGroup = service.createEnergyIntakeResultFormGroup();

        const energyIntakeResult = service.getEnergyIntakeResult(formGroup) as any;

        expect(energyIntakeResult).toMatchObject({});
      });

      it('should return IEnergyIntakeResult', () => {
        const formGroup = service.createEnergyIntakeResultFormGroup(sampleWithRequiredData);

        const energyIntakeResult = service.getEnergyIntakeResult(formGroup) as any;

        expect(energyIntakeResult).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEnergyIntakeResult should not enable id FormControl', () => {
        const formGroup = service.createEnergyIntakeResultFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEnergyIntakeResult should disable id FormControl', () => {
        const formGroup = service.createEnergyIntakeResultFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
