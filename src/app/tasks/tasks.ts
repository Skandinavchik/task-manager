import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { Search } from '../search/search'
import { TaskCard } from './task-card/task-card'
import { TasksService } from './services/tasks.service'

@Component({
  selector: 'app-tasks',
  imports: [Search, TaskCard],
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
