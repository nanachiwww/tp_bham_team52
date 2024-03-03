import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEnergyIntakeResult, NewEnergyIntakeResult } from '../energy-intake-result.model';

export type PartialUpdateEnergyIntakeResult = Partial<IEnergyIntakeResult> & Pick<IEnergyIntakeResult, 'id'>;

type RestOf<T extends IEnergyIntakeResult | NewEnergyIntakeResult> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestEnergyIntakeResult = RestOf<IEnergyIntakeResult>;

export type NewRestEnergyIntakeResult = RestOf<NewEnergyIntakeResult>;

export type PartialUpdateRestEnergyIntakeResult = RestOf<PartialUpdateEnergyIntakeResult>;

export type EntityResponseType = HttpResponse<IEnergyIntakeResult>;
export type EntityArrayResponseType = HttpResponse<IEnergyIntakeResult[]>;

@Injectable({ providedIn: 'root' })
export class EnergyIntakeResultService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/energy-intake-results');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(energyIntakeResult: NewEnergyIntakeResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(energyIntakeResult);
    return this.http
      .post<RestEnergyIntakeResult>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(energyIntakeResult: IEnergyIntakeResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(energyIntakeResult);
    return this.http
      .put<RestEnergyIntakeResult>(`${this.resourceUrl}/${this.getEnergyIntakeResultIdentifier(energyIntakeResult)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(energyIntakeResult: PartialUpdateEnergyIntakeResult): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(energyIntakeResult);
    return this.http
      .patch<RestEnergyIntakeResult>(`${this.resourceUrl}/${this.getEnergyIntakeResultIdentifier(energyIntakeResult)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEnergyIntakeResult>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEnergyIntakeResult[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEnergyIntakeResultIdentifier(energyIntakeResult: Pick<IEnergyIntakeResult, 'id'>): number {
    return energyIntakeResult.id;
  }

  compareEnergyIntakeResult(o1: Pick<IEnergyIntakeResult, 'id'> | null, o2: Pick<IEnergyIntakeResult, 'id'> | null): boolean {
    return o1 && o2 ? this.getEnergyIntakeResultIdentifier(o1) === this.getEnergyIntakeResultIdentifier(o2) : o1 === o2;
  }

  addEnergyIntakeResultToCollectionIfMissing<Type extends Pick<IEnergyIntakeResult, 'id'>>(
    energyIntakeResultCollection: Type[],
    ...energyIntakeResultsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const energyIntakeResults: Type[] = energyIntakeResultsToCheck.filter(isPresent);
    if (energyIntakeResults.length > 0) {
      const energyIntakeResultCollectionIdentifiers = energyIntakeResultCollection.map(
        energyIntakeResultItem => this.getEnergyIntakeResultIdentifier(energyIntakeResultItem)!
      );
      const energyIntakeResultsToAdd = energyIntakeResults.filter(energyIntakeResultItem => {
        const energyIntakeResultIdentifier = this.getEnergyIntakeResultIdentifier(energyIntakeResultItem);
        if (energyIntakeResultCollectionIdentifiers.includes(energyIntakeResultIdentifier)) {
          return false;
        }
        energyIntakeResultCollectionIdentifiers.push(energyIntakeResultIdentifier);
        return true;
      });
      return [...energyIntakeResultsToAdd, ...energyIntakeResultCollection];
    }
    return energyIntakeResultCollection;
  }

  protected convertDateFromClient<T extends IEnergyIntakeResult | NewEnergyIntakeResult | PartialUpdateEnergyIntakeResult>(
    energyIntakeResult: T
  ): RestOf<T> {
    return {
      ...energyIntakeResult,
      date: energyIntakeResult.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restEnergyIntakeResult: RestEnergyIntakeResult): IEnergyIntakeResult {
    return {
      ...restEnergyIntakeResult,
      date: restEnergyIntakeResult.date ? dayjs(restEnergyIntakeResult.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEnergyIntakeResult>): HttpResponse<IEnergyIntakeResult> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEnergyIntakeResult[]>): HttpResponse<IEnergyIntakeResult[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
