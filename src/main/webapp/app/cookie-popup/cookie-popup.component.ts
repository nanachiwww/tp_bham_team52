import { Component } from '@angular/core';
import { CookieService } from '../cookie.service';

@Component({
  selector: 'app-cookie-popup',
  templateUrl: './cookie-popup.component.html',
  styleUrls: ['./cookie-popup.component.scss'],
})
export class CookiePopupComponent {
  popupVisible: boolean = true; // Define the status of the popup window, When default is true, show popup window.

  constructor(private cookieService: CookieService) {}

  acceptCookies(): void {
    this.cookieService.acceptCookies();
    this.popupVisible = false; // Close the pop-up window after the user clicks accept
  }

  rejectCookies(): void {
    this.cookieService.rejectCookies();
    this.popupVisible = false; // Close the pop-up window after the user clicks reject
  }
}
