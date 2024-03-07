import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor() {}

  hasAcceptedCookies(): boolean {
    return !!localStorage.getItem('acceptedCookies');
  }

  acceptCookies(): void {
    localStorage.setItem('acceptedCookies', 'true');
  }

  rejectCookies(): void {}
}
