import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISleepRecord } from '../sleep-record.model';
import { SleepRecordService } from '../service/sleep-record.service';

@Injectable({ providedIn: 'root' })
export class SleepRecordRoutingResolveService implements Resolve<ISleepRecord | null> {
  constructor(protected service: SleepRecordService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISleepRecord | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sleepRecord: HttpResponse<ISleepRecord>) => {
          if (sleepRecord.body) {
            return of(sleepRecord.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
