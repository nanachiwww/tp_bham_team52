import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISleepRecord, NewSleepRecord } from '../sleep-record.model';

export type PartialUpdateSleepRecord = Partial<ISleepRecord> & Pick<ISleepRecord, 'id'>;

type RestOf<T extends ISleepRecord | NewSleepRecord> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

export type RestSleepRecord = RestOf<ISleepRecord>;

export type NewRestSleepRecord = RestOf<NewSleepRecord>;

export type PartialUpdateRestSleepRecord = RestOf<PartialUpdateSleepRecord>;

export type EntityResponseType = HttpResponse<ISleepRecord>;
export type EntityArrayResponseType = HttpResponse<ISleepRecord[]>;

@Injectable({ providedIn: 'root' })
export class SleepRecordService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sleep-records');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sleepRecord: NewSleepRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sleepRecord);
    return this.http
      .post<RestSleepRecord>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(sleepRecord: ISleepRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sleepRecord);
    return this.http
      .put<RestSleepRecord>(`${this.resourceUrl}/${this.getSleepRecordIdentifier(sleepRecord)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(sleepRecord: PartialUpdateSleepRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sleepRecord);
    return this.http
      .patch<RestSleepRecord>(`${this.resourceUrl}/${this.getSleepRecordIdentifier(sleepRecord)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSleepRecord>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSleepRecord[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSleepRecordIdentifier(sleepRecord: Pick<ISleepRecord, 'id'>): number {
    return sleepRecord.id;
  }

  compareSleepRecord(o1: Pick<ISleepRecord, 'id'> | null, o2: Pick<ISleepRecord, 'id'> | null): boolean {
    return o1 && o2 ? this.getSleepRecordIdentifier(o1) === this.getSleepRecordIdentifier(o2) : o1 === o2;
  }

  addSleepRecordToCollectionIfMissing<Type extends Pick<ISleepRecord, 'id'>>(
    sleepRecordCollection: Type[],
    ...sleepRecordsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sleepRecords: Type[] = sleepRecordsToCheck.filter(isPresent);
    if (sleepRecords.length > 0) {
      const sleepRecordCollectionIdentifiers = sleepRecordCollection.map(
        sleepRecordItem => this.getSleepRecordIdentifier(sleepRecordItem)!
      );
      const sleepRecordsToAdd = sleepRecords.filter(sleepRecordItem => {
        const sleepRecordIdentifier = this.getSleepRecordIdentifier(sleepRecordItem);
        if (sleepRecordCollectionIdentifiers.includes(sleepRecordIdentifier)) {
          return false;
        }
        sleepRecordCollectionIdentifiers.push(sleepRecordIdentifier);
        return true;
      });
      return [...sleepRecordsToAdd, ...sleepRecordCollection];
    }
    return sleepRecordCollection;
  }

  protected convertDateFromClient<T extends ISleepRecord | NewSleepRecord | PartialUpdateSleepRecord>(sleepRecord: T): RestOf<T> {
    return {
      ...sleepRecord,
      startTime: sleepRecord.startTime?.toJSON() ?? null,
      endTime: sleepRecord.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSleepRecord: RestSleepRecord): ISleepRecord {
    return {
      ...restSleepRecord,
      startTime: restSleepRecord.startTime ? dayjs(restSleepRecord.startTime) : undefined,
      endTime: restSleepRecord.endTime ? dayjs(restSleepRecord.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSleepRecord>): HttpResponse<ISleepRecord> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSleepRecord[]>): HttpResponse<ISleepRecord[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
