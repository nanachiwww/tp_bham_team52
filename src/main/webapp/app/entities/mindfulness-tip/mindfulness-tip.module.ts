import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MindfulnessTipComponent } from './list/mindfulness-tip.component';
import { MindfulnessTipDetailComponent } from './detail/mindfulness-tip-detail.component';
import { MindfulnessTipUpdateComponent } from './update/mindfulness-tip-update.component';
import { MindfulnessTipDeleteDialogComponent } from './delete/mindfulness-tip-delete-dialog.component';
import { MindfulnessTipRoutingModule } from './route/mindfulness-tip-routing.module';

@NgModule({
  imports: [SharedModule, MindfulnessTipRoutingModule],
  declarations: [
    MindfulnessTipComponent,
    MindfulnessTipDetailComponent,
    MindfulnessTipUpdateComponent,
    MindfulnessTipDeleteDialogComponent,
  ],
})
export class MindfulnessTipModule {}
