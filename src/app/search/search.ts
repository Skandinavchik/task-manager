import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule, FormControl } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-search',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search implements OnInit {
  placeholder = input<string>('')
  debounceMs = input<number>(0)
  search = output<string>()

  readonly searchControl = new FormControl('', { nonNullable: true })

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceMs()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: value => this.search.emit(value),
        error: err => console.error(err),
      })
  }

  onClear() {
    this.searchControl.reset()
  }
}
