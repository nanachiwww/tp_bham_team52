import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedicine } from '../medicine.model';
import { MedicineService } from '../service/medicine.service';

@Injectable({ providedIn: 'root' })
export class MedicineRoutingResolveService implements Resolve<IMedicine | null> {
  constructor(protected service: MedicineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedicine | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((medicine: HttpResponse<IMedicine>) => {
          if (medicine.body) {
            return of(medicine.body);
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
