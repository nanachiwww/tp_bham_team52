import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISleepRecord } from '../sleep-record.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, SleepRecordService } from '../service/sleep-record.service';
import { SleepRecordDeleteDialogComponent } from '../delete/sleep-record-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  selector: 'jhi-sleep-record',
  templateUrl: './sleep-record.component.html',
  styleUrls: ['./sleep-record.component.scss'],
})
export class SleepRecordComponent implements OnInit {
  newrecord = { start: new Date(), end: new Date() };
  // Methods to handle play and stop events
  play: boolean = true;
  rating: boolean = false;
  timeing: string = '';
  timerId: ReturnType<typeof setInterval> | undefined;
  startRecording() {
    // Implement start recording functionality
    this.play = false;
    this.newrecord.start = new Date();
    this.timerId = setInterval(() => {
      this.updatetimer();
    }, 1000);
  }

  stopRecording() {
    // Implement stop recording functionality
    this.play = true;
    clearInterval(this.timerId);
    this.newrecord.end = new Date();
    //submit:
    this.rating = true;
    this.router.navigate(['/sleep-record/new', this.newrecord]);
  }

  updatetimer() {
    var diffinseconds: number = (Date.now() - this.newrecord.start.getTime()) / 1000;
    this.timeing =
      'Hours: ' +
      Math.floor(diffinseconds / (60 * 60)) +
      ' Minutes: ' +
      Math.floor((diffinseconds / 60) % (60 * 60)) +
      ' Seconds: ' +
      Math.floor(diffinseconds % 60);
  }

  sleepRecords?: ISleepRecord[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected sleepRecordService: SleepRecordService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: ISleepRecord): number => this.sleepRecordService.getSleepRecordIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(sleepRecord: ISleepRecord): void {
    const modalRef = this.modalService.open(SleepRecordDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sleepRecord = sleepRecord;
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
    this.sleepRecords = this.refineData(dataFromBody);
  }

  protected refineData(data: ISleepRecord[]): ISleepRecord[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ISleepRecord[] | null): ISleepRecord[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.sleepRecordService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
