import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core'
import { Search } from '../search/search'
import { TaskCard } from './task-card/task-card'
import { SupabaseService } from '../supabase/supabase'

export type Task = {
  id: string
  title: string
  description: string | null
}

@Component({
  selector: 'app-tasks',
  imports: [Search, TaskCard],
  templateUrl: './tasks.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks implements OnInit {
  supabaseService = inject(SupabaseService)
  isLoading = signal(false)
  tasks = signal<Task[]>([])

  async getTasks() {
    this.isLoading.update(current => !current)
    const { data } = await this.supabaseService.client
      .from('tasks')
      .select('*')

    this.tasks.set(data as Task[])
    this.isLoading.update(current => !current)
  }

  ngOnInit() {
    this.getTasks()
  }

  onSearch(queryString: string) {
    console.log(queryString)
  }
}
