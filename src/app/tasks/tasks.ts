import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { Search } from '../search/search'
import { TaskCard } from './task-card/task-card'
import { TasksService } from './services/tasks.service'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-tasks',
  imports: [Search, TaskCard, MatProgressSpinnerModule],
  templateUrl: './tasks.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks implements OnInit {
  tasksService = inject(TasksService)

  ngOnInit() {
    this.tasksService.loadTasks()
  }

  onSearch(queryString: string) {
    console.log(queryString)
  }
}
