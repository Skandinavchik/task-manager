import { Injectable, computed, inject, signal } from '@angular/core'
import { SupabaseService } from '../../supabase/supabase'

export type Task = {
  id: string
  title: string
  description: string | null
  created_at: string
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private supabaseService = inject(SupabaseService)
  private readonly PAGE_SIZE = 10

  tasks = signal<Task[]>([])
  totalCount = signal(0)
  isLoading = signal(false)
  searchQuery = signal('')

  hasMore = computed(() => this.tasks().length < this.totalCount())

  async loadTasks() {
    this.searchQuery.set('')
    this.tasks.set([])
    this.totalCount.set(0)
    await this.loadMore()
  }

  async search(query: string) {
    if (this.searchQuery() === query) return
    this.searchQuery.set(query)
    this.tasks.set([])
    this.totalCount.set(0)
    await this.loadMore()
  }

  async loadMore() {
    if (this.isLoading() || (this.totalCount() > 0 && !this.hasMore())) return

    this.isLoading.set(true)

    let query = this.supabaseService.client
      .from('tasks')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(this.PAGE_SIZE)

    const searchStr = this.searchQuery().trim()
    if (searchStr) {
      const safeQuery = searchStr.replace(/"/g, '""')
      query = query.or(`title.ilike."%${safeQuery}%",description.ilike."%${safeQuery}%"`)
    }

    const tasks = this.tasks()
    const lastItem = tasks[tasks.length - 1]
    if (lastItem) {
      query = query.or(
        `created_at.lt.${lastItem.created_at},` +
        `and(created_at.eq.${lastItem.created_at},id.lt.${lastItem.id})`,
      )
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Error loading tasks:', error)
      this.isLoading.set(false)
      return
    }

    this.tasks.update(prev => [...prev, ...(data as Task[])])
    this.totalCount.set(count ?? 0)
    this.isLoading.set(false)
  }
}
