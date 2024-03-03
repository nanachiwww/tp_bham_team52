import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserProfileComponent } from './list/user-profile.component';
import { UserProfileDetailComponent } from './detail/user-profile-detail.component';
import { UserProfileUpdateComponent } from './update/user-profile-update.component';
import { UserProfileDeleteDialogComponent } from './delete/user-profile-delete-dialog.component';
import { UserProfileRoutingModule } from './route/user-profile-routing.module';

@NgModule({
  imports: [SharedModule, UserProfileRoutingModule],
  declarations: [UserProfileComponent, UserProfileDetailComponent, UserProfileUpdateComponent, UserProfileDeleteDialogComponent],
})
export class UserProfileModule {}
