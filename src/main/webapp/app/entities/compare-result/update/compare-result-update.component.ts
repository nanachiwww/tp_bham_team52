import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CompareResultFormService, CompareResultFormGroup } from './compare-result-form.service';
import { ICompareResult } from '../compare-result.model';
import { CompareResultService } from '../service/compare-result.service';

@Component({
  selector: 'jhi-compare-result-update',
  templateUrl: './compare-result-update.component.html',
})
export class CompareResultUpdateComponent implements OnInit {
  isSaving = false;
  compareResult: ICompareResult | null = null;

  editForm: CompareResultFormGroup = this.compareResultFormService.createCompareResultFormGroup();

  constructor(
    protected compareResultService: CompareResultService,
    protected compareResultFormService: CompareResultFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compareResult }) => {
      this.compareResult = compareResult;
      if (compareResult) {
        this.updateForm(compareResult);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compareResult = this.compareResultFormService.getCompareResult(this.editForm);
    if (compareResult.id !== null) {
      this.subscribeToSaveResponse(this.compareResultService.update(compareResult));
    } else {
      this.subscribeToSaveResponse(this.compareResultService.create(compareResult));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompareResult>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(compareResult: ICompareResult): void {
    this.compareResult = compareResult;
    this.compareResultFormService.resetForm(this.editForm, compareResult);
  }
}
