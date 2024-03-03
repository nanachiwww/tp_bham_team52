import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEnergyIntakeResult } from '../energy-intake-result.model';
import { EnergyIntakeResultService } from '../service/energy-intake-result.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './energy-intake-result-delete-dialog.component.html',
})
export class EnergyIntakeResultDeleteDialogComponent {
  energyIntakeResult?: IEnergyIntakeResult;

  constructor(protected energyIntakeResultService: EnergyIntakeResultService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.energyIntakeResultService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
