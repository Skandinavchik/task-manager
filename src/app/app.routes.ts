import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks-details-layout/tasks-details-layout').then(m => m.TasksDetailsLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./tasks/tasks').then(m => m.Tasks),
        outlet: 'tasks-list',
      },
      {
        path: ':id',
        loadComponent: () => import('./tasks/task-details/task-details').then(m => m.TaskDetails),
        outlet: 'task-details',
      },
    ],
  },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then(m => m.NotFound),
    title: '404 - Page Not Found',
  },
]
