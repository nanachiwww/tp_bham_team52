import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-profile',
        data: { pageTitle: 'UserProfiles' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'workout',
        data: { pageTitle: 'Workouts' },
        loadChildren: () => import('./workout/workout.module').then(m => m.WorkoutModule),
      },
      {
        path: 'exercise',
        data: { pageTitle: 'Exercises' },
        loadChildren: () => import('./exercise/exercise.module').then(m => m.ExerciseModule),
      },
      {
        path: 'item',
        data: { pageTitle: 'Items' },
        loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
      },
      {
        path: 'energy-intake-result',
        data: { pageTitle: 'EnergyIntakeResults' },
        loadChildren: () => import('./energy-intake-result/energy-intake-result.module').then(m => m.EnergyIntakeResultModule),
      },
      {
        path: 'mood-tracker',
        data: { pageTitle: 'MoodTrackers' },
        loadChildren: () => import('./mood-tracker/mood-tracker.module').then(m => m.MoodTrackerModule),
      },
      {
        path: 'stress-tracker',
        data: { pageTitle: 'StressTrackers' },
        loadChildren: () => import('./stress-tracker/stress-tracker.module').then(m => m.StressTrackerModule),
      },
      {
        path: 'mindfulness-practice',
        data: { pageTitle: 'MindfulnessPractices' },
        loadChildren: () => import('./mindfulness-practice/mindfulness-practice.module').then(m => m.MindfulnessPracticeModule),
      },
      {
        path: 'mindfulness-tip',
        data: { pageTitle: 'MindfulnessTips' },
        loadChildren: () => import('./mindfulness-tip/mindfulness-tip.module').then(m => m.MindfulnessTipModule),
      },
      {
        path: 'medicine',
        data: { pageTitle: 'Medicines' },
        loadChildren: () => import('./medicine/medicine.module').then(m => m.MedicineModule),
      },
      {
        path: 'sleep-record',
        data: { pageTitle: 'SleepRecords' },
        loadChildren: () => import('./sleep-record/sleep-record.module').then(m => m.SleepRecordModule),
      },
      {
        path: 'custom-goal',
        data: { pageTitle: 'CustomGoals' },
        loadChildren: () => import('./custom-goal/custom-goal.module').then(m => m.CustomGoalModule),
      },
      {
        path: 'compare-result',
        data: { pageTitle: 'CompareResults' },
        loadChildren: () => import('./compare-result/compare-result.module').then(m => m.CompareResultModule),
      },
      {
        path: 'dashboard',
        data: { pageTitle: 'Dashboards' },
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'recommendation',
        data: { pageTitle: 'Recommendation' },
        loadChildren: () => import('./Recommendation/recommendation.module').then(m => m.RecommendationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
