import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserProfile } from '../user-profile.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-profile.test-samples';

import { UserProfileService } from './user-profile.service';

const requireRestSample: IUserProfile = {
  ...sampleWithRequiredData,
};

describe('UserProfile Service', () => {
  let service: UserProfileService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserProfile | IUserProfile[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a UserProfile', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userProfile = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userProfile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserProfile', () => {
      const userProfile = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userProfile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserProfile', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserProfile', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserProfile', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserProfileToCollectionIfMissing', () => {
      it('should add a UserProfile to an empty array', () => {
        const userProfile: IUserProfile = sampleWithRequiredData;
        expectedResult = service.addUserProfileToCollectionIfMissing([], userProfile);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userProfile);
      });

      it('should not add a UserProfile to an array that contains it', () => {
        const userProfile: IUserProfile = sampleWithRequiredData;
        const userProfileCollection: IUserProfile[] = [
          {
            ...userProfile,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserProfileToCollectionIfMissing(userProfileCollection, userProfile);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserProfile to an array that doesn't contain it", () => {
        const userProfile: IUserProfile = sampleWithRequiredData;
        const userProfileCollection: IUserProfile[] = [sampleWithPartialData];
        expectedResult = service.addUserProfileToCollectionIfMissing(userProfileCollection, userProfile);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userProfile);
      });

      it('should add only unique UserProfile to an array', () => {
        const userProfileArray: IUserProfile[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userProfileCollection: IUserProfile[] = [sampleWithRequiredData];
        expectedResult = service.addUserProfileToCollectionIfMissing(userProfileCollection, ...userProfileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userProfile: IUserProfile = sampleWithRequiredData;
        const userProfile2: IUserProfile = sampleWithPartialData;
        expectedResult = service.addUserProfileToCollectionIfMissing([], userProfile, userProfile2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userProfile);
        expect(expectedResult).toContain(userProfile2);
      });

      it('should accept null and undefined values', () => {
        const userProfile: IUserProfile = sampleWithRequiredData;
        expectedResult = service.addUserProfileToCollectionIfMissing([], null, userProfile, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userProfile);
      });

      it('should return initial array if no UserProfile is added', () => {
        const userProfileCollection: IUserProfile[] = [sampleWithRequiredData];
        expectedResult = service.addUserProfileToCollectionIfMissing(userProfileCollection, undefined, null);
        expect(expectedResult).toEqual(userProfileCollection);
      });
    });

    describe('compareUserProfile', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserProfile(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserProfile(entity1, entity2);
        const compareResult2 = service.compareUserProfile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserProfile(entity1, entity2);
        const compareResult2 = service.compareUserProfile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserProfile(entity1, entity2);
        const compareResult2 = service.compareUserProfile(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
