import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnDestroy, OnInit, signal } from '@angular/core'
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog'
import { LayoutService } from '../services/layout.service'
import { TasksService } from '../services/tasks.service'
import { TaskFormDialog, TaskFormDialogData } from '../task-form-dialog/task-form-dialog'

@Component({
  selector: 'app-task-details',
  imports: [
    DatePipe,
    RouterLink,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetails implements OnInit, OnDestroy {
  id = input.required<string>()

  private readonly layout = inject(LayoutService)
  private readonly tasksService = inject(TasksService)
  private readonly dialog = inject(MatDialog)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)

  readonly backLink = ['/tasks', { outlets: { 'task-details': null } }]
  completing = signal(false)

  readonly taskResource = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.tasksService.getTask(id),
  })

  ngOnInit() {
    this.layout.detailActive.set(true)
  }
  ngOnDestroy() {
    this.layout.detailActive.set(false)
  }

  onEdit() {
    const task = this.taskResource.value()
    if (!task) return

    this.dialog
      .open<TaskFormDialog, TaskFormDialogData>(TaskFormDialog, {
        width: '480px',
        maxWidth: '95vw',
        autoFocus: 'first-tabbable',
        data: { task },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updated => {
        if (updated) this.taskResource.reload()
      })
  }

  onComplete() {
    const task = this.taskResource.value()
    if (!task || this.completing()) return

    this.completing.set(true)
    this.tasksService
      .completeTask(task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.completing.set(false)
          this.router.navigate(this.backLink)
        },
        error: () => this.completing.set(false),
      })
  }

  onBack() {
    this.router.navigate(this.backLink)
  }
}
