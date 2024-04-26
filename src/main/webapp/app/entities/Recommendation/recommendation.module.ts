import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

import { RecommendationComponent } from './list/recommendation.component';
import { RECOMMENDATION_ROUTE } from './recommendation.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([RECOMMENDATION_ROUTE])],
  declarations: [RecommendationComponent],
})
export class RecommendationModule {}
