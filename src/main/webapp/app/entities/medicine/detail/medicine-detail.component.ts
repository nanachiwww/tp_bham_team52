import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedicine } from '../medicine.model';

@Component({
  selector: 'jhi-medicine-detail',
  templateUrl: './medicine-detail.component.html',
})
export class MedicineDetailComponent implements OnInit {
  medicine: IMedicine | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicine }) => {
      this.medicine = medicine;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
