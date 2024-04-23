import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap, timer, Subscription, takeWhile } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, MindfulnessPracticeService } from '../service/mindfulness-practice.service';
import { MindfulnessPracticeDeleteDialogComponent } from '../delete/mindfulness-practice-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { MindfulnessTipService } from '../../mindfulness-tip/service/mindfulness-tip.service';

@Component({
  selector: 'jhi-mindfulness-practice',
  templateUrl: './mindfulness-practice.component.html',
  styleUrls: ['./mindfulness-practice.component.scss'],
})
export class MindfulnessPracticeComponent implements OnInit {
  mindfulnessPractices?: IMindfulnessPractice[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  currentPractice: string | null = null;
  availableDurations = Array.from({ length: 12 }, (_, i) => (i + 1) * 10);
  selectedDuration = 10;
  countdown = 0;
  progress = 0;
  timerSubscription?: Subscription;
  numberOfBreaths = 5;

  constructor(
    protected mindfulnessPracticeService: MindfulnessPracticeService,
    private mindfulnessTipService: MindfulnessTipService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IMindfulnessPractice): number => this.mindfulnessPracticeService.getMindfulnessPracticeIdentifier(item);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentPractice = params['type'];
    });
    this.countdown = this.selectedDuration;
  }

  startTimer(): void {
    this.countdown = this.selectedDuration;
    this.progress = 100;

    this.timerSubscription?.unsubscribe();

    const countdownTimer = timer(0, 60000).pipe(takeWhile(() => this.countdown > 0));

    this.timerSubscription = countdownTimer.subscribe(() => {
      this.countdown--; // Decrease countdown
      this.progress = (this.countdown / this.selectedDuration) * 100;
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(mindfulnessPractice: IMindfulnessPractice): void {
    const modalRef = this.modalService.open(MindfulnessPracticeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.mindfulnessPractice = mindfulnessPractice;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.mindfulnessPractices = this.refineData(dataFromBody);
  }

  protected refineData(data: IMindfulnessPractice[]): IMindfulnessPractice[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IMindfulnessPractice[] | null): IMindfulnessPractice[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.mindfulnessPracticeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
