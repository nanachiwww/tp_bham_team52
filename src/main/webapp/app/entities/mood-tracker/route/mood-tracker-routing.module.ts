import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MoodTrackerComponent } from '../list/mood-tracker.component';
import { MoodTrackerDetailComponent } from '../detail/mood-tracker-detail.component';
import { MoodTrackerUpdateComponent } from '../update/mood-tracker-update.component';
import { MoodTrackerRoutingResolveService } from './mood-tracker-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const moodTrackerRoute: Routes = [
  {
    path: '',
    component: MoodTrackerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MoodTrackerDetailComponent,
    resolve: {
      moodTracker: MoodTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MoodTrackerUpdateComponent,
    resolve: {
      moodTracker: MoodTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MoodTrackerUpdateComponent,
    resolve: {
      moodTracker: MoodTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moodTrackerRoute)],
  exports: [RouterModule],
})
export class MoodTrackerRoutingModule {}
