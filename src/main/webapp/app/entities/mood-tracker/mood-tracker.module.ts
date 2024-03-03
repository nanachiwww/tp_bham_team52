import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MoodTrackerComponent } from './list/mood-tracker.component';
import { MoodTrackerDetailComponent } from './detail/mood-tracker-detail.component';
import { MoodTrackerUpdateComponent } from './update/mood-tracker-update.component';
import { MoodTrackerDeleteDialogComponent } from './delete/mood-tracker-delete-dialog.component';
import { MoodTrackerRoutingModule } from './route/mood-tracker-routing.module';

@NgModule({
  imports: [SharedModule, MoodTrackerRoutingModule],
  declarations: [MoodTrackerComponent, MoodTrackerDetailComponent, MoodTrackerUpdateComponent, MoodTrackerDeleteDialogComponent],
})
export class MoodTrackerModule {}
