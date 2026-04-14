import { Injectable, inject, signal } from '@angular/core'
import { SupabaseService } from '../../supabase/supabase'

export type Task = {
  id: string
  title: string
  description: string | null
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private supabaseService = inject(SupabaseService)

  tasks = signal<Task[]>([])
  isLoading = signal(false)

  async loadTasks() {
    this.isLoading.set(true)
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .select('*')

    if (error) {
      console.error('Error loading tasks:', error)
      this.isLoading.set(false)
      return
    }

    this.tasks.set(data as Task[])
    this.isLoading.set(false)
  }
}
