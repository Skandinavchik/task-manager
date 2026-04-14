import { Injectable, inject } from '@angular/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar)

  success(message: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ['snackbar-success'],
      ...config,
    })
  }

  error(message: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
      panelClass: ['snackbar-error'],
      ...config,
    })
  }
}
