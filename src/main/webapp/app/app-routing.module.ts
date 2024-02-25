import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SleepComponent } from './sleep/sleep.component';
import { DietComponent } from './diet/diet.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { MentalhealthComponent } from './mentalhealth/mentalhealth.component';
import { GoalsComponent } from './goals/goals.component';
import { MedicineComponent } from './medicine/medicine.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'medicine',
          component: MedicineComponent,
          data: {
            pageTitle: 'Medicine',
            //authorities: [Authority.USER], // Adjust the authority as needed
          },
          //canActivate: [UserRouteAccessService],
        },
        {
          path: 'goals',
          component: GoalsComponent,
          data: {
            pageTitle: 'Goals',
            //authorities: [Authority.USER], // Adjust the authority as needed
          },
          //canActivate: [UserRouteAccessService],
        },
        {
          path: 'mentalhealth',
          component: MentalhealthComponent,
          data: {
            pageTitle: 'Mental Health',
            //authorities: [Authority.USER], // Adjust the authority as needed
          },
          //canActivate: [UserRouteAccessService],
        },
        {
          path: 'workouts',
          component: WorkoutsComponent,
          data: {
            pageTitle: 'Workouts',
            //authorities: [Authority.USER], // Adjust the authority as needed
          },
          //canActivate: [UserRouteAccessService],
        },
        {
          path: 'diet',
          component: DietComponent,
          data: {
            pageTitle: 'Diet',
            //authorities: [Authority.USER], // Adjust the authority as needed
          },
          //canActivate: [UserRouteAccessService],
        },
        {
          path: 'sleep',
          component: SleepComponent,
          data: {
            pageTitle: 'Sleep',
            //authorities: [Authority.USER], // Adjust the authority as needed
          },
          //canActivate: [UserRouteAccessService],
        },
        {
          path: 'dashboard',
          component: DashboardComponent,
          data: {
            pageTitle: 'Dashboard',
            //authorities: [Authority.USER], // Adjust the authority as needed
          },
          //canActivate: [UserRouteAccessService],
        },

        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
