import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDashboard, NewDashboard } from '../dashboard.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDashboard for edit and NewDashboardFormGroupInput for create.
 */
type DashboardFormGroupInput = IDashboard | PartialWithRequiredKeyOf<NewDashboard>;

type DashboardFormDefaults = Pick<NewDashboard, 'id'>;

type DashboardFormGroupContent = {
  id: FormControl<IDashboard['id'] | NewDashboard['id']>;
  overview: FormControl<IDashboard['overview']>;
};

export type DashboardFormGroup = FormGroup<DashboardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DashboardFormService {
  createDashboardFormGroup(dashboard: DashboardFormGroupInput = { id: null }): DashboardFormGroup {
    const dashboardRawValue = {
      ...this.getFormDefaults(),
      ...dashboard,
    };
    return new FormGroup<DashboardFormGroupContent>({
      id: new FormControl(
        { value: dashboardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      overview: new FormControl(dashboardRawValue.overview),
    });
  }

  getDashboard(form: DashboardFormGroup): IDashboard | NewDashboard {
    return form.getRawValue() as IDashboard | NewDashboard;
  }

  resetForm(form: DashboardFormGroup, dashboard: DashboardFormGroupInput): void {
    const dashboardRawValue = { ...this.getFormDefaults(), ...dashboard };
    form.reset(
      {
        ...dashboardRawValue,
        id: { value: dashboardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DashboardFormDefaults {
    return {
      id: null,
    };
  }
}
