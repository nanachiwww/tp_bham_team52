import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StressTrackerComponent } from '../list/stress-tracker.component';
import { StressTrackerDetailComponent } from '../detail/stress-tracker-detail.component';
import { StressTrackerUpdateComponent } from '../update/stress-tracker-update.component';
import { StressTrackerRoutingResolveService } from './stress-tracker-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const stressTrackerRoute: Routes = [
  {
    path: '',
    component: StressTrackerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StressTrackerDetailComponent,
    resolve: {
      stressTracker: StressTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StressTrackerUpdateComponent,
    resolve: {
      stressTracker: StressTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StressTrackerUpdateComponent,
    resolve: {
      stressTracker: StressTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stressTrackerRoute)],
  exports: [RouterModule],
})
export class StressTrackerRoutingModule {}
