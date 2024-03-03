import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMoodTracker } from '../mood-tracker.model';
import { MoodTrackerService } from '../service/mood-tracker.service';

@Injectable({ providedIn: 'root' })
export class MoodTrackerRoutingResolveService implements Resolve<IMoodTracker | null> {
  constructor(protected service: MoodTrackerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMoodTracker | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((moodTracker: HttpResponse<IMoodTracker>) => {
          if (moodTracker.body) {
            return of(moodTracker.body);
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
