import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompareResult } from '../compare-result.model';

@Component({
  selector: 'jhi-compare-result-detail',
  templateUrl: './compare-result-detail.component.html',
})
export class CompareResultDetailComponent implements OnInit {
  compareResult: ICompareResult | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compareResult }) => {
      this.compareResult = compareResult;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
