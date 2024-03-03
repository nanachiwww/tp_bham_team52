import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MindfulnessPracticeComponent } from './list/mindfulness-practice.component';
import { MindfulnessPracticeDetailComponent } from './detail/mindfulness-practice-detail.component';
import { MindfulnessPracticeUpdateComponent } from './update/mindfulness-practice-update.component';
import { MindfulnessPracticeDeleteDialogComponent } from './delete/mindfulness-practice-delete-dialog.component';
import { MindfulnessPracticeRoutingModule } from './route/mindfulness-practice-routing.module';

@NgModule({
  imports: [SharedModule, MindfulnessPracticeRoutingModule],
  declarations: [
    MindfulnessPracticeComponent,
    MindfulnessPracticeDetailComponent,
    MindfulnessPracticeUpdateComponent,
    MindfulnessPracticeDeleteDialogComponent,
  ],
})
export class MindfulnessPracticeModule {}
