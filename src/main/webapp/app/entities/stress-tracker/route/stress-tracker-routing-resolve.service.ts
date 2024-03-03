import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStressTracker } from '../stress-tracker.model';
import { StressTrackerService } from '../service/stress-tracker.service';

@Injectable({ providedIn: 'root' })
export class StressTrackerRoutingResolveService implements Resolve<IStressTracker | null> {
  constructor(protected service: StressTrackerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStressTracker | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stressTracker: HttpResponse<IStressTracker>) => {
          if (stressTracker.body) {
            return of(stressTracker.body);
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
