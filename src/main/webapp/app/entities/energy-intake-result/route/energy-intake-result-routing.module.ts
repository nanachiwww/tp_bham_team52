import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EnergyIntakeResultComponent } from '../list/energy-intake-result.component';
import { EnergyIntakeResultDetailComponent } from '../detail/energy-intake-result-detail.component';
import { EnergyIntakeResultUpdateComponent } from '../update/energy-intake-result-update.component';
import { EnergyIntakeResultRoutingResolveService } from './energy-intake-result-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const energyIntakeResultRoute: Routes = [
  {
    path: '',
    component: EnergyIntakeResultComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EnergyIntakeResultDetailComponent,
    resolve: {
      energyIntakeResult: EnergyIntakeResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EnergyIntakeResultUpdateComponent,
    resolve: {
      energyIntakeResult: EnergyIntakeResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EnergyIntakeResultUpdateComponent,
    resolve: {
      energyIntakeResult: EnergyIntakeResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(energyIntakeResultRoute)],
  exports: [RouterModule],
})
export class EnergyIntakeResultRoutingModule {}
