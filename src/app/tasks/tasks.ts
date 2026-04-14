import { effect, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core'
import { Search } from '../search/search'
import { TaskCard } from './task-card/task-card'
import { TasksService } from './services/tasks.service'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { TaskFormDialog } from './task-form-dialog/task-form-dialog'

@Component({
  selector: 'app-tasks',
  imports: [Search, TaskCard, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './tasks.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {
  tasksService = inject(TasksService)
  private readonly dialog = inject(MatDialog)
  scrollTrigger = viewChild<ElementRef>('scrollTrigger')

  constructor() {
    effect(onCleanup => {
      const el = this.scrollTrigger()?.nativeElement

      if (el) {
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && this.tasksService.hasMore()) {
            this.tasksService.loadMore()
          }
        })

        observer.observe(el)
        onCleanup(() => observer.disconnect())
      }
    })
  }

  onSearch(queryString: string) {
    this.tasksService.search(queryString)
  }

  openCreateDialog() {
    this.dialog.open(TaskFormDialog, {
      width: '480px',
      maxWidth: '95vw',
      autoFocus: 'first-tabbable',
    })
  }
}
