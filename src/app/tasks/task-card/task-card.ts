import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { RouterLink } from '@angular/router'
import { Task } from '../tasks'

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './task-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  task = input.required<Task>()
}
