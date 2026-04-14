import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class LayoutService {
  detailActive = signal(false)
}
