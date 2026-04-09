import { Component, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-root',
  imports: [MatButtonModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('task-manager')
}
