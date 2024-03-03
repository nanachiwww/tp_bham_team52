import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMindfulnessTip } from '../mindfulness-tip.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mindfulness-tip.test-samples';

import { MindfulnessTipService, RestMindfulnessTip } from './mindfulness-tip.service';

const requireRestSample: RestMindfulnessTip = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
};

describe('MindfulnessTip Service', () => {
  let service: MindfulnessTipService;
  let httpMock: HttpTestingController;
  let expectedResult: IMindfulnessTip | IMindfulnessTip[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MindfulnessTipService);
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

    it('should create a MindfulnessTip', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mindfulnessTip = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mindfulnessTip).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MindfulnessTip', () => {
      const mindfulnessTip = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mindfulnessTip).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MindfulnessTip', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MindfulnessTip', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MindfulnessTip', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMindfulnessTipToCollectionIfMissing', () => {
      it('should add a MindfulnessTip to an empty array', () => {
        const mindfulnessTip: IMindfulnessTip = sampleWithRequiredData;
        expectedResult = service.addMindfulnessTipToCollectionIfMissing([], mindfulnessTip);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mindfulnessTip);
      });

      it('should not add a MindfulnessTip to an array that contains it', () => {
        const mindfulnessTip: IMindfulnessTip = sampleWithRequiredData;
        const mindfulnessTipCollection: IMindfulnessTip[] = [
          {
            ...mindfulnessTip,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMindfulnessTipToCollectionIfMissing(mindfulnessTipCollection, mindfulnessTip);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MindfulnessTip to an array that doesn't contain it", () => {
        const mindfulnessTip: IMindfulnessTip = sampleWithRequiredData;
        const mindfulnessTipCollection: IMindfulnessTip[] = [sampleWithPartialData];
        expectedResult = service.addMindfulnessTipToCollectionIfMissing(mindfulnessTipCollection, mindfulnessTip);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mindfulnessTip);
      });

      it('should add only unique MindfulnessTip to an array', () => {
        const mindfulnessTipArray: IMindfulnessTip[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mindfulnessTipCollection: IMindfulnessTip[] = [sampleWithRequiredData];
        expectedResult = service.addMindfulnessTipToCollectionIfMissing(mindfulnessTipCollection, ...mindfulnessTipArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mindfulnessTip: IMindfulnessTip = sampleWithRequiredData;
        const mindfulnessTip2: IMindfulnessTip = sampleWithPartialData;
        expectedResult = service.addMindfulnessTipToCollectionIfMissing([], mindfulnessTip, mindfulnessTip2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mindfulnessTip);
        expect(expectedResult).toContain(mindfulnessTip2);
      });

      it('should accept null and undefined values', () => {
        const mindfulnessTip: IMindfulnessTip = sampleWithRequiredData;
        expectedResult = service.addMindfulnessTipToCollectionIfMissing([], null, mindfulnessTip, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mindfulnessTip);
      });

      it('should return initial array if no MindfulnessTip is added', () => {
        const mindfulnessTipCollection: IMindfulnessTip[] = [sampleWithRequiredData];
        expectedResult = service.addMindfulnessTipToCollectionIfMissing(mindfulnessTipCollection, undefined, null);
        expect(expectedResult).toEqual(mindfulnessTipCollection);
      });
    });

    describe('compareMindfulnessTip', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMindfulnessTip(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMindfulnessTip(entity1, entity2);
        const compareResult2 = service.compareMindfulnessTip(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMindfulnessTip(entity1, entity2);
        const compareResult2 = service.compareMindfulnessTip(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMindfulnessTip(entity1, entity2);
        const compareResult2 = service.compareMindfulnessTip(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
