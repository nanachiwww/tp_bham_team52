import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMindfulnessTip, NewMindfulnessTip } from '../mindfulness-tip.model';

export type PartialUpdateMindfulnessTip = Partial<IMindfulnessTip> & Pick<IMindfulnessTip, 'id'>;

type RestOf<T extends IMindfulnessTip | NewMindfulnessTip> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestMindfulnessTip = RestOf<IMindfulnessTip>;

export type NewRestMindfulnessTip = RestOf<NewMindfulnessTip>;

export type PartialUpdateRestMindfulnessTip = RestOf<PartialUpdateMindfulnessTip>;

export type EntityResponseType = HttpResponse<IMindfulnessTip>;
export type EntityArrayResponseType = HttpResponse<IMindfulnessTip[]>;

@Injectable({ providedIn: 'root' })
export class MindfulnessTipService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mindfulness-tips');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mindfulnessTip: NewMindfulnessTip): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindfulnessTip);
    return this.http
      .post<RestMindfulnessTip>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(mindfulnessTip: IMindfulnessTip): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindfulnessTip);
    return this.http
      .put<RestMindfulnessTip>(`${this.resourceUrl}/${this.getMindfulnessTipIdentifier(mindfulnessTip)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(mindfulnessTip: PartialUpdateMindfulnessTip): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mindfulnessTip);
    return this.http
      .patch<RestMindfulnessTip>(`${this.resourceUrl}/${this.getMindfulnessTipIdentifier(mindfulnessTip)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMindfulnessTip>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMindfulnessTip[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMindfulnessTipIdentifier(mindfulnessTip: Pick<IMindfulnessTip, 'id'>): number {
    return mindfulnessTip.id;
  }

  compareMindfulnessTip(o1: Pick<IMindfulnessTip, 'id'> | null, o2: Pick<IMindfulnessTip, 'id'> | null): boolean {
    return o1 && o2 ? this.getMindfulnessTipIdentifier(o1) === this.getMindfulnessTipIdentifier(o2) : o1 === o2;
  }

  addMindfulnessTipToCollectionIfMissing<Type extends Pick<IMindfulnessTip, 'id'>>(
    mindfulnessTipCollection: Type[],
    ...mindfulnessTipsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mindfulnessTips: Type[] = mindfulnessTipsToCheck.filter(isPresent);
    if (mindfulnessTips.length > 0) {
      const mindfulnessTipCollectionIdentifiers = mindfulnessTipCollection.map(
        mindfulnessTipItem => this.getMindfulnessTipIdentifier(mindfulnessTipItem)!
      );
      const mindfulnessTipsToAdd = mindfulnessTips.filter(mindfulnessTipItem => {
        const mindfulnessTipIdentifier = this.getMindfulnessTipIdentifier(mindfulnessTipItem);
        if (mindfulnessTipCollectionIdentifiers.includes(mindfulnessTipIdentifier)) {
          return false;
        }
        mindfulnessTipCollectionIdentifiers.push(mindfulnessTipIdentifier);
        return true;
      });
      return [...mindfulnessTipsToAdd, ...mindfulnessTipCollection];
    }
    return mindfulnessTipCollection;
  }

  protected convertDateFromClient<T extends IMindfulnessTip | NewMindfulnessTip | PartialUpdateMindfulnessTip>(
    mindfulnessTip: T
  ): RestOf<T> {
    return {
      ...mindfulnessTip,
      createdDate: mindfulnessTip.createdDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMindfulnessTip: RestMindfulnessTip): IMindfulnessTip {
    return {
      ...restMindfulnessTip,
      createdDate: restMindfulnessTip.createdDate ? dayjs(restMindfulnessTip.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMindfulnessTip>): HttpResponse<IMindfulnessTip> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMindfulnessTip[]>): HttpResponse<IMindfulnessTip[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
