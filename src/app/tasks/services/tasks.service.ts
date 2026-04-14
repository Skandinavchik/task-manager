import { Injectable, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Observable, Subject, defer, filter, map, switchMap, tap } from 'rxjs'
import { SupabaseService } from '../../supabase/supabase'

export type Task = {
  id: string
  title: string
  description: string | null
  created_at: string
}

export type TaskInput = {
  title: string
  description: string | null
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private supabaseService = inject(SupabaseService)
  private readonly PAGE_SIZE = 10

  tasks = signal<Task[]>([])
  hasMore = signal(true)
  isLoading = signal(false)
  searchQuery = signal('')
  error = signal<string | null>(null)

  private readonly loadMore$ = new Subject<void>()

  constructor() {
    this.loadMore$
      .pipe(
        filter(() => !this.isLoading() && this.hasMore()),
        tap(() => {
          this.isLoading.set(true)
          this.error.set(null)
        }),
        switchMap(() => defer(() => this.buildQuery())),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.error.set(error.message)
          } else {
            const rows = (data ?? []) as Task[]
            this.tasks.update(prev => [...prev, ...rows])
            this.hasMore.set(rows.length === this.PAGE_SIZE)
          }
          this.isLoading.set(false)
        },
        error: err => {
          this.error.set(err?.message ?? 'Unknown error')
          this.isLoading.set(false)
        },
      })

    this.loadMore$.next()
  }

  loadMore() {
    this.loadMore$.next()
  }

  getTask(id: string): Observable<Task> {
    return defer(() =>
      this.supabaseService.client
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message)
        return data as Task
      }),
    )
  }

  createTask(input: TaskInput): Observable<Task> {
    return defer(() =>
      this.supabaseService.client
        .from('tasks')
        .insert(input)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message)
        return data as Task
      }),
      tap(task => {
        this.tasks.update(prev => [task, ...prev])
        this.error.set(null)
      }),
    )
  }

  updateTask(id: string, input: Partial<TaskInput>): Observable<Task> {
    return defer(() =>
      this.supabaseService.client
        .from('tasks')
        .update(input)
        .eq('id', id)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message)
        return data as Task
      }),
      tap(updated => {
        this.tasks.update(prev => prev.map(t => (t.id === updated.id ? updated : t)))
        this.error.set(null)
      }),
    )
  }

  completeTask(id: string): Observable<void> {
    return defer(() =>
      this.supabaseService.client
        .from('tasks')
        .delete({ count: 'exact' })
        .eq('id', id),
    ).pipe(
      map(({ error, count }) => {
        if (error) throw new Error(error.message)
        if (!count) throw new Error('Task was not deleted (check RLS delete policy)')
      }),
      tap(() => {
        this.tasks.update(prev => prev.filter(t => t.id !== id))
        this.error.set(null)
      }),
    )
  }

  search(query: string) {
    if (this.searchQuery() === query) return
    this.searchQuery.set(query)
    this.resetList()
    this.loadMore$.next()
  }

  reload() {
    this.searchQuery.set('')
    this.resetList()
    this.loadMore$.next()
  }

  private resetList() {
    this.tasks.set([])
    this.hasMore.set(true)
  }

  private buildQuery() {
    let query = this.supabaseService.client
      .from('tasks')
      .select('*')
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

    return query
  }
}
