import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-profile.test-samples';

import { UserProfileFormService } from './user-profile-form.service';

describe('UserProfile Form Service', () => {
  let service: UserProfileFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileFormService);
  });

  describe('Service methods', () => {
    describe('createUserProfileFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserProfileFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            email: expect.any(Object),
            password: expect.any(Object),
            name: expect.any(Object),
            age: expect.any(Object),
            gender: expect.any(Object),
            dashboard: expect.any(Object),
            compareResult: expect.any(Object),
          })
        );
      });

      it('passing IUserProfile should create a new form with FormGroup', () => {
        const formGroup = service.createUserProfileFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            email: expect.any(Object),
            password: expect.any(Object),
            name: expect.any(Object),
            age: expect.any(Object),
            gender: expect.any(Object),
            dashboard: expect.any(Object),
            compareResult: expect.any(Object),
          })
        );
      });
    });

    describe('getUserProfile', () => {
      it('should return NewUserProfile for default UserProfile initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserProfileFormGroup(sampleWithNewData);

        const userProfile = service.getUserProfile(formGroup) as any;

        expect(userProfile).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserProfile for empty UserProfile initial value', () => {
        const formGroup = service.createUserProfileFormGroup();

        const userProfile = service.getUserProfile(formGroup) as any;

        expect(userProfile).toMatchObject({});
      });

      it('should return IUserProfile', () => {
        const formGroup = service.createUserProfileFormGroup(sampleWithRequiredData);

        const userProfile = service.getUserProfile(formGroup) as any;

        expect(userProfile).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserProfile should not enable id FormControl', () => {
        const formGroup = service.createUserProfileFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserProfile should disable id FormControl', () => {
        const formGroup = service.createUserProfileFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
