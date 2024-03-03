import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMindfulnessPractice, NewMindfulnessPractice } from '../mindfulness-practice.model';

export type PartialUpdateMindfulnessPractice = Partial<IMindfulnessPractice> & Pick<IMindfulnessPractice, 'id'>;

type RestOf<T extends IMindfulnessPractice | NewMindfulnessPractice> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestMindfulnessPractice = RestOf<IMindfulnessPractice>;

export type NewRestMindfulnessPractice = RestOf<NewMindfulnessPractice>;

export type PartialUpdateRestMindfulnessPractice = RestOf<PartialUpdateMindfulnessPractice>;

export type EntityResponseType = HttpResponse<IMindfulnessPractice>;
export type EntityArrayResponseType = HttpResponse<IMindfulnessPractice[]>;

@Injectable({ providedIn: 'root' })
export class MindfulnessPracticeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mindfulness-practices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mindfulnessPractice: NewMindfulnessPractice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindfulnessPractice);
    return this.http
      .post<RestMindfulnessPractice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(mindfulnessPractice: IMindfulnessPractice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindfulnessPractice);
    return this.http
      .put<RestMindfulnessPractice>(`${this.resourceUrl}/${this.getMindfulnessPracticeIdentifier(mindfulnessPractice)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(mindfulnessPractice: PartialUpdateMindfulnessPractice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindfulnessPractice);
    return this.http
      .patch<RestMindfulnessPractice>(`${this.resourceUrl}/${this.getMindfulnessPracticeIdentifier(mindfulnessPractice)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMindfulnessPractice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMindfulnessPractice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMindfulnessPracticeIdentifier(mindfulnessPractice: Pick<IMindfulnessPractice, 'id'>): number {
    return mindfulnessPractice.id;
  }

  compareMindfulnessPractice(o1: Pick<IMindfulnessPractice, 'id'> | null, o2: Pick<IMindfulnessPractice, 'id'> | null): boolean {
    return o1 && o2 ? this.getMindfulnessPracticeIdentifier(o1) === this.getMindfulnessPracticeIdentifier(o2) : o1 === o2;
  }

  addMindfulnessPracticeToCollectionIfMissing<Type extends Pick<IMindfulnessPractice, 'id'>>(
    mindfulnessPracticeCollection: Type[],
    ...mindfulnessPracticesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mindfulnessPractices: Type[] = mindfulnessPracticesToCheck.filter(isPresent);
    if (mindfulnessPractices.length > 0) {
      const mindfulnessPracticeCollectionIdentifiers = mindfulnessPracticeCollection.map(
        mindfulnessPracticeItem => this.getMindfulnessPracticeIdentifier(mindfulnessPracticeItem)!
      );
      const mindfulnessPracticesToAdd = mindfulnessPractices.filter(mindfulnessPracticeItem => {
        const mindfulnessPracticeIdentifier = this.getMindfulnessPracticeIdentifier(mindfulnessPracticeItem);
        if (mindfulnessPracticeCollectionIdentifiers.includes(mindfulnessPracticeIdentifier)) {
          return false;
        }
        mindfulnessPracticeCollectionIdentifiers.push(mindfulnessPracticeIdentifier);
        return true;
      });
      return [...mindfulnessPracticesToAdd, ...mindfulnessPracticeCollection];
    }
    return mindfulnessPracticeCollection;
  }

  protected convertDateFromClient<T extends IMindfulnessPractice | NewMindfulnessPractice | PartialUpdateMindfulnessPractice>(
    mindfulnessPractice: T
  ): RestOf<T> {
    return {
      ...mindfulnessPractice,
      date: mindfulnessPractice.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMindfulnessPractice: RestMindfulnessPractice): IMindfulnessPractice {
    return {
      ...restMindfulnessPractice,
      date: restMindfulnessPractice.date ? dayjs(restMindfulnessPractice.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMindfulnessPractice>): HttpResponse<IMindfulnessPractice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMindfulnessPractice[]>): HttpResponse<IMindfulnessPractice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
