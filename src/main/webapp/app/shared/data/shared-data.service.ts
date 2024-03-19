import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  selectedValue: string = '';

  constructor() {}

  setSelectedValue(value: string): void {
    this.selectedValue = value;
  }

  getSelectedValue(): string {
    return this.selectedValue;
  }
}
