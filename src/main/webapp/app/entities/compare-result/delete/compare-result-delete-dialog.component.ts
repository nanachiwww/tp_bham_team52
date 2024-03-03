import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompareResult } from '../compare-result.model';
import { CompareResultService } from '../service/compare-result.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './compare-result-delete-dialog.component.html',
})
export class CompareResultDeleteDialogComponent {
  compareResult?: ICompareResult;

  constructor(protected compareResultService: CompareResultService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.compareResultService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
