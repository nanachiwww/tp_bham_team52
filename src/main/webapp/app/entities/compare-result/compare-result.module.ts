import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompareResultComponent } from './list/compare-result.component';
import { CompareResultDetailComponent } from './detail/compare-result-detail.component';
import { CompareResultUpdateComponent } from './update/compare-result-update.component';
import { CompareResultDeleteDialogComponent } from './delete/compare-result-delete-dialog.component';
import { CompareResultRoutingModule } from './route/compare-result-routing.module';

@NgModule({
  imports: [SharedModule, CompareResultRoutingModule],
  declarations: [CompareResultComponent, CompareResultDetailComponent, CompareResultUpdateComponent, CompareResultDeleteDialogComponent],
})
export class CompareResultModule {}
