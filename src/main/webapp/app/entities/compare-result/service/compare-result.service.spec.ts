import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompareResult } from '../compare-result.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../compare-result.test-samples';

import { CompareResultService, RestCompareResult } from './compare-result.service';

const requireRestSample: RestCompareResult = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('CompareResult Service', () => {
  let service: CompareResultService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompareResult | ICompareResult[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompareResultService);
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

    it('should create a CompareResult', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const compareResult = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(compareResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompareResult', () => {
      const compareResult = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(compareResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompareResult', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompareResult', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompareResult', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompareResultToCollectionIfMissing', () => {
      it('should add a CompareResult to an empty array', () => {
        const compareResult: ICompareResult = sampleWithRequiredData;
        expectedResult = service.addCompareResultToCollectionIfMissing([], compareResult);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compareResult);
      });

      it('should not add a CompareResult to an array that contains it', () => {
        const compareResult: ICompareResult = sampleWithRequiredData;
        const compareResultCollection: ICompareResult[] = [
          {
            ...compareResult,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompareResultToCollectionIfMissing(compareResultCollection, compareResult);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompareResult to an array that doesn't contain it", () => {
        const compareResult: ICompareResult = sampleWithRequiredData;
        const compareResultCollection: ICompareResult[] = [sampleWithPartialData];
        expectedResult = service.addCompareResultToCollectionIfMissing(compareResultCollection, compareResult);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compareResult);
      });

      it('should add only unique CompareResult to an array', () => {
        const compareResultArray: ICompareResult[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const compareResultCollection: ICompareResult[] = [sampleWithRequiredData];
        expectedResult = service.addCompareResultToCollectionIfMissing(compareResultCollection, ...compareResultArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const compareResult: ICompareResult = sampleWithRequiredData;
        const compareResult2: ICompareResult = sampleWithPartialData;
        expectedResult = service.addCompareResultToCollectionIfMissing([], compareResult, compareResult2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(compareResult);
        expect(expectedResult).toContain(compareResult2);
      });

      it('should accept null and undefined values', () => {
        const compareResult: ICompareResult = sampleWithRequiredData;
        expectedResult = service.addCompareResultToCollectionIfMissing([], null, compareResult, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(compareResult);
      });

      it('should return initial array if no CompareResult is added', () => {
        const compareResultCollection: ICompareResult[] = [sampleWithRequiredData];
        expectedResult = service.addCompareResultToCollectionIfMissing(compareResultCollection, undefined, null);
        expect(expectedResult).toEqual(compareResultCollection);
      });
    });

    describe('compareCompareResult', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompareResult(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompareResult(entity1, entity2);
        const compareResult2 = service.compareCompareResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompareResult(entity1, entity2);
        const compareResult2 = service.compareCompareResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompareResult(entity1, entity2);
        const compareResult2 = service.compareCompareResult(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
