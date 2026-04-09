import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit } from '@angular/core'
import { LayoutService } from '../services/layout'

@Component({
  selector: 'app-task-details',
  imports: [],
  templateUrl: './task-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetails implements OnInit, OnDestroy {
  id = input.required<string>()

  private readonly layout = inject(LayoutService)

  ngOnInit() {
    this.layout.detailActive.set(true)
  }
  ngOnDestroy() {
    this.layout.detailActive.set(false)
  }
}
