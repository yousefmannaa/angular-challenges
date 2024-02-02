import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error(error);
    alert('An error occurred:' + error);
  }
}
