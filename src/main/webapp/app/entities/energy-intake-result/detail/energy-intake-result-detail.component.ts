import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEnergyIntakeResult } from '../energy-intake-result.model';

@Component({
  selector: 'jhi-energy-intake-result-detail',
  templateUrl: './energy-intake-result-detail.component.html',
})
export class EnergyIntakeResultDetailComponent implements OnInit {
  energyIntakeResult: IEnergyIntakeResult | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ energyIntakeResult }) => {
      this.energyIntakeResult = energyIntakeResult;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
