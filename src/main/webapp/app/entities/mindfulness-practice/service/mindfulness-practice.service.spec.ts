import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mindfulness-practice.test-samples';

import { MindfulnessPracticeService, RestMindfulnessPractice } from './mindfulness-practice.service';

const requireRestSample: RestMindfulnessPractice = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('MindfulnessPractice Service', () => {
  let service: MindfulnessPracticeService;
  let httpMock: HttpTestingController;
  let expectedResult: IMindfulnessPractice | IMindfulnessPractice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MindfulnessPracticeService);
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

    it('should create a MindfulnessPractice', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mindfulnessPractice = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mindfulnessPractice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MindfulnessPractice', () => {
      const mindfulnessPractice = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mindfulnessPractice).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MindfulnessPractice', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MindfulnessPractice', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MindfulnessPractice', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMindfulnessPracticeToCollectionIfMissing', () => {
      it('should add a MindfulnessPractice to an empty array', () => {
        const mindfulnessPractice: IMindfulnessPractice = sampleWithRequiredData;
        expectedResult = service.addMindfulnessPracticeToCollectionIfMissing([], mindfulnessPractice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mindfulnessPractice);
      });

      it('should not add a MindfulnessPractice to an array that contains it', () => {
        const mindfulnessPractice: IMindfulnessPractice = sampleWithRequiredData;
        const mindfulnessPracticeCollection: IMindfulnessPractice[] = [
          {
            ...mindfulnessPractice,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMindfulnessPracticeToCollectionIfMissing(mindfulnessPracticeCollection, mindfulnessPractice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MindfulnessPractice to an array that doesn't contain it", () => {
        const mindfulnessPractice: IMindfulnessPractice = sampleWithRequiredData;
        const mindfulnessPracticeCollection: IMindfulnessPractice[] = [sampleWithPartialData];
        expectedResult = service.addMindfulnessPracticeToCollectionIfMissing(mindfulnessPracticeCollection, mindfulnessPractice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mindfulnessPractice);
      });

      it('should add only unique MindfulnessPractice to an array', () => {
        const mindfulnessPracticeArray: IMindfulnessPractice[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mindfulnessPracticeCollection: IMindfulnessPractice[] = [sampleWithRequiredData];
        expectedResult = service.addMindfulnessPracticeToCollectionIfMissing(mindfulnessPracticeCollection, ...mindfulnessPracticeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mindfulnessPractice: IMindfulnessPractice = sampleWithRequiredData;
        const mindfulnessPractice2: IMindfulnessPractice = sampleWithPartialData;
        expectedResult = service.addMindfulnessPracticeToCollectionIfMissing([], mindfulnessPractice, mindfulnessPractice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mindfulnessPractice);
        expect(expectedResult).toContain(mindfulnessPractice2);
      });

      it('should accept null and undefined values', () => {
        const mindfulnessPractice: IMindfulnessPractice = sampleWithRequiredData;
        expectedResult = service.addMindfulnessPracticeToCollectionIfMissing([], null, mindfulnessPractice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mindfulnessPractice);
      });

      it('should return initial array if no MindfulnessPractice is added', () => {
        const mindfulnessPracticeCollection: IMindfulnessPractice[] = [sampleWithRequiredData];
        expectedResult = service.addMindfulnessPracticeToCollectionIfMissing(mindfulnessPracticeCollection, undefined, null);
        expect(expectedResult).toEqual(mindfulnessPracticeCollection);
      });
    });

    describe('compareMindfulnessPractice', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMindfulnessPractice(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMindfulnessPractice(entity1, entity2);
        const compareResult2 = service.compareMindfulnessPractice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMindfulnessPractice(entity1, entity2);
        const compareResult2 = service.compareMindfulnessPractice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMindfulnessPractice(entity1, entity2);
        const compareResult2 = service.compareMindfulnessPractice(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
