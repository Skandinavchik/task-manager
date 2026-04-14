import { effect, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core'
import { Search } from '../search/search'
import { TaskCard } from './task-card/task-card'
import { TasksService } from './services/tasks.service'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-tasks',
  imports: [Search, TaskCard, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './tasks.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks implements OnInit {
  tasksService = inject(TasksService)
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

  ngOnInit() {
    this.tasksService.loadTasks()
  }

  onSearch(queryString: string) {
    this.tasksService.search(queryString)
  }
}
