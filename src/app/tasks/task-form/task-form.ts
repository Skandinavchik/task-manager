import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { Task, TaskInput } from '../services/tasks.service'

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  task = input<Task | null>(null)
  submitting = input<boolean>(false)
  submitLabel = input<string>('Save')

  formSubmit = output<TaskInput>()
  cancel = output<void>()

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    description: new FormControl<string | null>(null),
  })

  constructor() {
    effect(() => {
      const task = this.task()
      this.form.reset({
        title: task?.title ?? '',
        description: task?.description ?? null,
      })
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const { title, description } = this.form.getRawValue()
    this.formSubmit.emit({
      title: title.trim(),
      description: description?.trim() || null,
    })
  }

  onCancel() {
    this.cancel.emit()
  }
}
