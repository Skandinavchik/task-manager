import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutService } from '../services/layout'

@Component({
  selector: 'app-tasks-details-layout',
  imports: [RouterOutlet],
  templateUrl: './tasks-details-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDetailsLayout {
  layout = inject(LayoutService)

  masterClasses = computed(() =>
    [
      'overflow-y-auto',
      'w-full',
      this.layout.detailActive() ? 'hidden' : 'block',
      'xl:block xl:w-96 xl:shrink-0',
    ].join(' '),
  )

  detailClasses = computed(() =>
    [
      'overflow-y-auto',
      'w-full',
      this.layout.detailActive() ? 'block' : 'hidden',
      'xl:block xl:flex-1',
    ].join(' '),
  )
}
