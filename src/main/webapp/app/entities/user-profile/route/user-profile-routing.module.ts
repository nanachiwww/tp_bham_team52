import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserProfileComponent } from '../list/user-profile.component';
import { UserProfileDetailComponent } from '../detail/user-profile-detail.component';
import { UserProfileUpdateComponent } from '../update/user-profile-update.component';
import { UserProfileRoutingResolveService } from './user-profile-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userProfileRoute: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserProfileDetailComponent,
    resolve: {
      userProfile: UserProfileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserProfileUpdateComponent,
    resolve: {
      userProfile: UserProfileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserProfileUpdateComponent,
    resolve: {
      userProfile: UserProfileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userProfileRoute)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {}
