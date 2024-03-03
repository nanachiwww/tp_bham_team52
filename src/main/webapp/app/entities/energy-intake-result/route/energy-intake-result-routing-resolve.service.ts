import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEnergyIntakeResult } from '../energy-intake-result.model';
import { EnergyIntakeResultService } from '../service/energy-intake-result.service';

@Injectable({ providedIn: 'root' })
export class EnergyIntakeResultRoutingResolveService implements Resolve<IEnergyIntakeResult | null> {
  constructor(protected service: EnergyIntakeResultService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEnergyIntakeResult | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((energyIntakeResult: HttpResponse<IEnergyIntakeResult>) => {
          if (energyIntakeResult.body) {
            return of(energyIntakeResult.body);
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
