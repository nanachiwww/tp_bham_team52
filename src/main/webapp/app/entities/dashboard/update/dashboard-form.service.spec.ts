import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dashboard.test-samples';

import { DashboardFormService } from './dashboard-form.service';

describe('Dashboard Form Service', () => {
  let service: DashboardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardFormService);
  });

  describe('Service methods', () => {
    describe('createDashboardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDashboardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            overview: expect.any(Object),
          })
        );
      });

      it('passing IDashboard should create a new form with FormGroup', () => {
        const formGroup = service.createDashboardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            overview: expect.any(Object),
          })
        );
      });
    });

    describe('getDashboard', () => {
      it('should return NewDashboard for default Dashboard initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDashboardFormGroup(sampleWithNewData);

        const dashboard = service.getDashboard(formGroup) as any;

        expect(dashboard).toMatchObject(sampleWithNewData);
      });

      it('should return NewDashboard for empty Dashboard initial value', () => {
        const formGroup = service.createDashboardFormGroup();

        const dashboard = service.getDashboard(formGroup) as any;

        expect(dashboard).toMatchObject({});
      });

      it('should return IDashboard', () => {
        const formGroup = service.createDashboardFormGroup(sampleWithRequiredData);

        const dashboard = service.getDashboard(formGroup) as any;

        expect(dashboard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDashboard should not enable id FormControl', () => {
        const formGroup = service.createDashboardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDashboard should disable id FormControl', () => {
        const formGroup = service.createDashboardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
