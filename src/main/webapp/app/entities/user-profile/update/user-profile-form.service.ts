import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserProfile, NewUserProfile } from '../user-profile.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserProfile for edit and NewUserProfileFormGroupInput for create.
 */
type UserProfileFormGroupInput = IUserProfile | PartialWithRequiredKeyOf<NewUserProfile>;

type UserProfileFormDefaults = Pick<NewUserProfile, 'id'>;

type UserProfileFormGroupContent = {
  id: FormControl<IUserProfile['id'] | NewUserProfile['id']>;
  username: FormControl<IUserProfile['username']>;
  email: FormControl<IUserProfile['email']>;
  password: FormControl<IUserProfile['password']>;
  name: FormControl<IUserProfile['name']>;
  age: FormControl<IUserProfile['age']>;
  gender: FormControl<IUserProfile['gender']>;
  dashboard: FormControl<IUserProfile['dashboard']>;
  compareResult: FormControl<IUserProfile['compareResult']>;
};

export type UserProfileFormGroup = FormGroup<UserProfileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserProfileFormService {
  createUserProfileFormGroup(userProfile: UserProfileFormGroupInput = { id: null }): UserProfileFormGroup {
    const userProfileRawValue = {
      ...this.getFormDefaults(),
      ...userProfile,
    };
    return new FormGroup<UserProfileFormGroupContent>({
      id: new FormControl(
        { value: userProfileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(userProfileRawValue.username, {
        validators: [Validators.required],
      }),
      email: new FormControl(userProfileRawValue.email, {
        validators: [Validators.required],
      }),
      password: new FormControl(userProfileRawValue.password, {
        validators: [Validators.required],
      }),
      name: new FormControl(userProfileRawValue.name),
      age: new FormControl(userProfileRawValue.age),
      gender: new FormControl(userProfileRawValue.gender),
      dashboard: new FormControl(userProfileRawValue.dashboard),
      compareResult: new FormControl(userProfileRawValue.compareResult),
    });
  }

  getUserProfile(form: UserProfileFormGroup): IUserProfile | NewUserProfile {
    return form.getRawValue() as IUserProfile | NewUserProfile;
  }

  resetForm(form: UserProfileFormGroup, userProfile: UserProfileFormGroupInput): void {
    const userProfileRawValue = { ...this.getFormDefaults(), ...userProfile };
    form.reset(
      {
        ...userProfileRawValue,
        id: { value: userProfileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserProfileFormDefaults {
    return {
      id: null,
    };
  }
}
