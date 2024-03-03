import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEnergyIntakeResult } from '../energy-intake-result.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../energy-intake-result.test-samples';

import { EnergyIntakeResultService, RestEnergyIntakeResult } from './energy-intake-result.service';

const requireRestSample: RestEnergyIntakeResult = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('EnergyIntakeResult Service', () => {
  let service: EnergyIntakeResultService;
  let httpMock: HttpTestingController;
  let expectedResult: IEnergyIntakeResult | IEnergyIntakeResult[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EnergyIntakeResultService);
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

    it('should create a EnergyIntakeResult', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const energyIntakeResult = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(energyIntakeResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EnergyIntakeResult', () => {
      const energyIntakeResult = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(energyIntakeResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EnergyIntakeResult', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EnergyIntakeResult', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EnergyIntakeResult', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEnergyIntakeResultToCollectionIfMissing', () => {
      it('should add a EnergyIntakeResult to an empty array', () => {
        const energyIntakeResult: IEnergyIntakeResult = sampleWithRequiredData;
        expectedResult = service.addEnergyIntakeResultToCollectionIfMissing([], energyIntakeResult);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(energyIntakeResult);
      });

      it('should not add a EnergyIntakeResult to an array that contains it', () => {
        const energyIntakeResult: IEnergyIntakeResult = sampleWithRequiredData;
        const energyIntakeResultCollection: IEnergyIntakeResult[] = [
          {
            ...energyIntakeResult,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEnergyIntakeResultToCollectionIfMissing(energyIntakeResultCollection, energyIntakeResult);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EnergyIntakeResult to an array that doesn't contain it", () => {
        const energyIntakeResult: IEnergyIntakeResult = sampleWithRequiredData;
        const energyIntakeResultCollection: IEnergyIntakeResult[] = [sampleWithPartialData];
        expectedResult = service.addEnergyIntakeResultToCollectionIfMissing(energyIntakeResultCollection, energyIntakeResult);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(energyIntakeResult);
      });

      it('should add only unique EnergyIntakeResult to an array', () => {
        const energyIntakeResultArray: IEnergyIntakeResult[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const energyIntakeResultCollection: IEnergyIntakeResult[] = [sampleWithRequiredData];
        expectedResult = service.addEnergyIntakeResultToCollectionIfMissing(energyIntakeResultCollection, ...energyIntakeResultArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const energyIntakeResult: IEnergyIntakeResult = sampleWithRequiredData;
        const energyIntakeResult2: IEnergyIntakeResult = sampleWithPartialData;
        expectedResult = service.addEnergyIntakeResultToCollectionIfMissing([], energyIntakeResult, energyIntakeResult2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(energyIntakeResult);
        expect(expectedResult).toContain(energyIntakeResult2);
      });

      it('should accept null and undefined values', () => {
        const energyIntakeResult: IEnergyIntakeResult = sampleWithRequiredData;
        expectedResult = service.addEnergyIntakeResultToCollectionIfMissing([], null, energyIntakeResult, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(energyIntakeResult);
      });

      it('should return initial array if no EnergyIntakeResult is added', () => {
        const energyIntakeResultCollection: IEnergyIntakeResult[] = [sampleWithRequiredData];
        expectedResult = service.addEnergyIntakeResultToCollectionIfMissing(energyIntakeResultCollection, undefined, null);
        expect(expectedResult).toEqual(energyIntakeResultCollection);
      });
    });

    describe('compareEnergyIntakeResult', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEnergyIntakeResult(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEnergyIntakeResult(entity1, entity2);
        const compareResult2 = service.compareEnergyIntakeResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEnergyIntakeResult(entity1, entity2);
        const compareResult2 = service.compareEnergyIntakeResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEnergyIntakeResult(entity1, entity2);
        const compareResult2 = service.compareEnergyIntakeResult(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
