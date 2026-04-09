import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-tasks-details-layout',
  imports: [RouterOutlet],
  templateUrl: './tasks-details-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDetailsLayout {
  detailActive = signal(false)

  masterClasses = computed(() =>
    [
      'overflow-y-auto',
      'w-full',
      this.detailActive() ? 'hidden' : 'block',
      'xl:block xl:w-96 xl:shrink-0',
    ].join(' '),
  )

  detailClasses = computed(() =>
    [
      'overflow-y-auto',
      'w-full',
      this.detailActive() ? 'block' : 'hidden',
      'xl:block xl:flex-1',
    ].join(' '),
  )
}
