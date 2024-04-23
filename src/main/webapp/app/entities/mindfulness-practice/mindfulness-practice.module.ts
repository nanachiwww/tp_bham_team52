import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MindfulnessPracticeComponent } from './list/mindfulness-practice.component';
import { MindfulnessPracticeDetailComponent } from './detail/mindfulness-practice-detail.component';
import { MindfulnessPracticeUpdateComponent } from './update/mindfulness-practice-update.component';
import { MindfulnessPracticeDeleteDialogComponent } from './delete/mindfulness-practice-delete-dialog.component';
import { MindfulnessPracticeRoutingModule } from './route/mindfulness-practice-routing.module';

const routes: Routes = [
  {
    path: 'mindfulness-practice',
    component: MindfulnessPracticeComponent,
  },
  {
    path: '',
    redirectTo: '/mindfulness-practice',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [SharedModule, MindfulnessPracticeRoutingModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [
    MindfulnessPracticeComponent,
    MindfulnessPracticeDetailComponent,
    MindfulnessPracticeUpdateComponent,
    MindfulnessPracticeDeleteDialogComponent,
  ],
})
export class MindfulnessPracticeModule {}
export class AppRoutingModule {}
