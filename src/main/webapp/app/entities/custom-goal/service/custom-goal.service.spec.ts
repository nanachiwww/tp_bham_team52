import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICustomGoal } from '../custom-goal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../custom-goal.test-samples';

import { CustomGoalService } from './custom-goal.service';

const requireRestSample: ICustomGoal = {
  ...sampleWithRequiredData,
};

describe('CustomGoal Service', () => {
  let service: CustomGoalService;
  let httpMock: HttpTestingController;
  let expectedResult: ICustomGoal | ICustomGoal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CustomGoalService);
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

    it('should create a CustomGoal', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const customGoal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(customGoal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CustomGoal', () => {
      const customGoal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(customGoal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CustomGoal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CustomGoal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CustomGoal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCustomGoalToCollectionIfMissing', () => {
      it('should add a CustomGoal to an empty array', () => {
        const customGoal: ICustomGoal = sampleWithRequiredData;
        expectedResult = service.addCustomGoalToCollectionIfMissing([], customGoal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customGoal);
      });

      it('should not add a CustomGoal to an array that contains it', () => {
        const customGoal: ICustomGoal = sampleWithRequiredData;
        const customGoalCollection: ICustomGoal[] = [
          {
            ...customGoal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCustomGoalToCollectionIfMissing(customGoalCollection, customGoal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CustomGoal to an array that doesn't contain it", () => {
        const customGoal: ICustomGoal = sampleWithRequiredData;
        const customGoalCollection: ICustomGoal[] = [sampleWithPartialData];
        expectedResult = service.addCustomGoalToCollectionIfMissing(customGoalCollection, customGoal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customGoal);
      });

      it('should add only unique CustomGoal to an array', () => {
        const customGoalArray: ICustomGoal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const customGoalCollection: ICustomGoal[] = [sampleWithRequiredData];
        expectedResult = service.addCustomGoalToCollectionIfMissing(customGoalCollection, ...customGoalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customGoal: ICustomGoal = sampleWithRequiredData;
        const customGoal2: ICustomGoal = sampleWithPartialData;
        expectedResult = service.addCustomGoalToCollectionIfMissing([], customGoal, customGoal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customGoal);
        expect(expectedResult).toContain(customGoal2);
      });

      it('should accept null and undefined values', () => {
        const customGoal: ICustomGoal = sampleWithRequiredData;
        expectedResult = service.addCustomGoalToCollectionIfMissing([], null, customGoal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customGoal);
      });

      it('should return initial array if no CustomGoal is added', () => {
        const customGoalCollection: ICustomGoal[] = [sampleWithRequiredData];
        expectedResult = service.addCustomGoalToCollectionIfMissing(customGoalCollection, undefined, null);
        expect(expectedResult).toEqual(customGoalCollection);
      });
    });

    describe('compareCustomGoal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCustomGoal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCustomGoal(entity1, entity2);
        const compareResult2 = service.compareCustomGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCustomGoal(entity1, entity2);
        const compareResult2 = service.compareCustomGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCustomGoal(entity1, entity2);
        const compareResult2 = service.compareCustomGoal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
