import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MindfulnessTipFormService, MindfulnessTipFormGroup } from './mindfulness-tip-form.service';
import { IMindfulnessTip } from '../mindfulness-tip.model';
import { MindfulnessTipService } from '../service/mindfulness-tip.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-mindfulness-tip-update',
  templateUrl: './mindfulness-tip-update.component.html',
})
export class MindfulnessTipUpdateComponent implements OnInit {
  isSaving = false;
  mindfulnessTip: IMindfulnessTip | null = null;

  editForm: MindfulnessTipFormGroup = this.mindfulnessTipFormService.createMindfulnessTipFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected mindfulnessTipService: MindfulnessTipService,
    protected mindfulnessTipFormService: MindfulnessTipFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mindfulnessTip }) => {
      this.mindfulnessTip = mindfulnessTip;
      if (mindfulnessTip) {
        this.updateForm(mindfulnessTip);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mindfulnessTip = this.mindfulnessTipFormService.getMindfulnessTip(this.editForm);
    if (mindfulnessTip.id !== null) {
      this.subscribeToSaveResponse(this.mindfulnessTipService.update(mindfulnessTip));
    } else {
      this.subscribeToSaveResponse(this.mindfulnessTipService.create(mindfulnessTip));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMindfulnessTip>>): void {
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

  protected updateForm(mindfulnessTip: IMindfulnessTip): void {
    this.mindfulnessTip = mindfulnessTip;
    this.mindfulnessTipFormService.resetForm(this.editForm, mindfulnessTip);
  }
}
