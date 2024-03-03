import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedicine, NewMedicine } from '../medicine.model';

export type PartialUpdateMedicine = Partial<IMedicine> & Pick<IMedicine, 'id'>;

type RestOf<T extends IMedicine | NewMedicine> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestMedicine = RestOf<IMedicine>;

export type NewRestMedicine = RestOf<NewMedicine>;

export type PartialUpdateRestMedicine = RestOf<PartialUpdateMedicine>;

export type EntityResponseType = HttpResponse<IMedicine>;
export type EntityArrayResponseType = HttpResponse<IMedicine[]>;

@Injectable({ providedIn: 'root' })
export class MedicineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medicines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(medicine: NewMedicine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medicine);
    return this.http
      .post<RestMedicine>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(medicine: IMedicine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medicine);
    return this.http
      .put<RestMedicine>(`${this.resourceUrl}/${this.getMedicineIdentifier(medicine)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(medicine: PartialUpdateMedicine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(medicine);
    return this.http
      .patch<RestMedicine>(`${this.resourceUrl}/${this.getMedicineIdentifier(medicine)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMedicine>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMedicine[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMedicineIdentifier(medicine: Pick<IMedicine, 'id'>): number {
    return medicine.id;
  }

  compareMedicine(o1: Pick<IMedicine, 'id'> | null, o2: Pick<IMedicine, 'id'> | null): boolean {
    return o1 && o2 ? this.getMedicineIdentifier(o1) === this.getMedicineIdentifier(o2) : o1 === o2;
  }

  addMedicineToCollectionIfMissing<Type extends Pick<IMedicine, 'id'>>(
    medicineCollection: Type[],
    ...medicinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const medicines: Type[] = medicinesToCheck.filter(isPresent);
    if (medicines.length > 0) {
      const medicineCollectionIdentifiers = medicineCollection.map(medicineItem => this.getMedicineIdentifier(medicineItem)!);
      const medicinesToAdd = medicines.filter(medicineItem => {
        const medicineIdentifier = this.getMedicineIdentifier(medicineItem);
        if (medicineCollectionIdentifiers.includes(medicineIdentifier)) {
          return false;
        }
        medicineCollectionIdentifiers.push(medicineIdentifier);
        return true;
      });
      return [...medicinesToAdd, ...medicineCollection];
    }
    return medicineCollection;
  }

  protected convertDateFromClient<T extends IMedicine | NewMedicine | PartialUpdateMedicine>(medicine: T): RestOf<T> {
    return {
      ...medicine,
      date: medicine.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMedicine: RestMedicine): IMedicine {
    return {
      ...restMedicine,
      date: restMedicine.date ? dayjs(restMedicine.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMedicine>): HttpResponse<IMedicine> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMedicine[]>): HttpResponse<IMedicine[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
