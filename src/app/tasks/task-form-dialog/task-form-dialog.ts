import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { NotificationService } from '../../shared/notification.service'
import { Task, TaskInput, TasksService } from '../services/tasks.service'
import { TaskForm } from '../task-form/task-form'

export type TaskFormDialogData = {
  task?: Task | null
}

@Component({
  selector: 'app-task-form-dialog',
  imports: [MatDialogModule, TaskForm],
  templateUrl: './task-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormDialog {
  private readonly tasksService = inject(TasksService)
  private readonly notification = inject(NotificationService)
  private readonly dialogRef = inject(MatDialogRef<TaskFormDialog, Task>)
  private readonly data = inject<TaskFormDialogData>(MAT_DIALOG_DATA, { optional: true }) ?? {}
  private readonly destroyRef = inject(DestroyRef)

  readonly task = this.data.task ?? null
  readonly title = this.task ? 'Edit task' : 'New task'
  readonly submitLabel = this.task ? 'Save' : 'Create'

  submitting = signal(false)
  error = signal<string | null>(null)

  onSubmit(input: TaskInput) {
    if (this.task && input.title === this.task.title
      && (input.description ?? null) === (this.task.description ?? null)) {
      this.dialogRef.close()
      return
    }

    this.submitting.set(true)
    this.error.set(null)

    const request$ = this.task
      ? this.tasksService.updateTask(this.task.id, input)
      : this.tasksService.createTask(input)

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: task => {
        this.submitting.set(false)
        this.notification.success(this.task ? 'Task updated' : 'Task created')
        this.dialogRef.close(task)
      },
      error: err => {
        this.submitting.set(false)
        this.error.set(err?.message ?? 'Failed to save task')
      },
    })
  }

  onCancel() {
    this.dialogRef.close()
  }
}
