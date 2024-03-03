import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompareResult } from '../compare-result.model';
import { CompareResultService } from '../service/compare-result.service';

@Injectable({ providedIn: 'root' })
export class CompareResultRoutingResolveService implements Resolve<ICompareResult | null> {
  constructor(protected service: CompareResultService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompareResult | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((compareResult: HttpResponse<ICompareResult>) => {
          if (compareResult.body) {
            return of(compareResult.body);
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
