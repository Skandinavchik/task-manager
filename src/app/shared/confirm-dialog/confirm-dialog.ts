import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

export type ConfirmDialogData = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>)
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA)

  onCancel() {
    this.dialogRef.close(false)
  }

  onConfirm() {
    this.dialogRef.close(true)
  }
}
