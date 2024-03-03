import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkoutComponent } from '../list/workout.component';
import { WorkoutDetailComponent } from '../detail/workout-detail.component';
import { WorkoutUpdateComponent } from '../update/workout-update.component';
import { WorkoutRoutingResolveService } from './workout-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const workoutRoute: Routes = [
  {
    path: '',
    component: WorkoutComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorkoutDetailComponent,
    resolve: {
      workout: WorkoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkoutUpdateComponent,
    resolve: {
      workout: WorkoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkoutUpdateComponent,
    resolve: {
      workout: WorkoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workoutRoute)],
  exports: [RouterModule],
})
export class WorkoutRoutingModule {}
