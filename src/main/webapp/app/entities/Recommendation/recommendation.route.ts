import { Route } from '@angular/router';

import { RecommendationComponent } from './list/recommendation.component';

export const RECOMMENDATION_ROUTE: Route = {
  path: '',
  component: RecommendationComponent,
  data: {
    pageTitle: 'Recommendation',
  },
};
