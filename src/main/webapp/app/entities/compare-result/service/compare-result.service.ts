import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompareResult, NewCompareResult } from '../compare-result.model';

export type PartialUpdateCompareResult = Partial<ICompareResult> & Pick<ICompareResult, 'id'>;

type RestOf<T extends ICompareResult | NewCompareResult> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestCompareResult = RestOf<ICompareResult>;

export type NewRestCompareResult = RestOf<NewCompareResult>;

export type PartialUpdateRestCompareResult = RestOf<PartialUpdateCompareResult>;

export type EntityResponseType = HttpResponse<ICompareResult>;
export type EntityArrayResponseType = HttpResponse<ICompareResult[]>;

@Injectable({ providedIn: 'root' })
export class CompareResultService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/compare-results');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(compareResult: NewCompareResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(compareResult);
    return this.http
      .post<RestCompareResult>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(compareResult: ICompareResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(compareResult);
    return this.http
      .put<RestCompareResult>(`${this.resourceUrl}/${this.getCompareResultIdentifier(compareResult)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(compareResult: PartialUpdateCompareResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(compareResult);
    return this.http
      .patch<RestCompareResult>(`${this.resourceUrl}/${this.getCompareResultIdentifier(compareResult)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCompareResult>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCompareResult[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompareResultIdentifier(compareResult: Pick<ICompareResult, 'id'>): number {
    return compareResult.id;
  }

  compareCompareResult(o1: Pick<ICompareResult, 'id'> | null, o2: Pick<ICompareResult, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompareResultIdentifier(o1) === this.getCompareResultIdentifier(o2) : o1 === o2;
  }

  addCompareResultToCollectionIfMissing<Type extends Pick<ICompareResult, 'id'>>(
    compareResultCollection: Type[],
    ...compareResultsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const compareResults: Type[] = compareResultsToCheck.filter(isPresent);
    if (compareResults.length > 0) {
      const compareResultCollectionIdentifiers = compareResultCollection.map(
        compareResultItem => this.getCompareResultIdentifier(compareResultItem)!
      );
      const compareResultsToAdd = compareResults.filter(compareResultItem => {
        const compareResultIdentifier = this.getCompareResultIdentifier(compareResultItem);
        if (compareResultCollectionIdentifiers.includes(compareResultIdentifier)) {
          return false;
        }
        compareResultCollectionIdentifiers.push(compareResultIdentifier);
        return true;
      });
      return [...compareResultsToAdd, ...compareResultCollection];
    }
    return compareResultCollection;
  }

  protected convertDateFromClient<T extends ICompareResult | NewCompareResult | PartialUpdateCompareResult>(compareResult: T): RestOf<T> {
    return {
      ...compareResult,
      timestamp: compareResult.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCompareResult: RestCompareResult): ICompareResult {
    return {
      ...restCompareResult,
      timestamp: restCompareResult.timestamp ? dayjs(restCompareResult.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCompareResult>): HttpResponse<ICompareResult> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCompareResult[]>): HttpResponse<ICompareResult[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
