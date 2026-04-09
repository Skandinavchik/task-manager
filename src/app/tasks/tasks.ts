import { Component, signal } from '@angular/core'
import { Search } from '../search/search'
import { TaskCard } from './task-card/task-card'

export type Task = {
  id: string
  title: string
  description: string
}

const tasks: Task[] = [
  {
    id: 'asdsadasdasd',
    title: 'Fist task',
    description: 'Description of the first task. It should be very long to test card behavior. The long string should clamp to 2 lines with 3 dots',
  },
  {
    id: 'asdasfsdfgfdgfdg',
    title: 'Second task',
    description: 'Description of the second task',
  },
  {
    id: 'asdsadasrtyrtytrydasd',
    title: 'Fist task',
    description: 'Description of the first task. It should be very long to test card behavior. The long string should clamp to 2 lines with 3 dots',
  },
  {
    id: 'tgytrytryutrtrrt',
    title: 'Second task',
    description: 'Description of the second task',
  },
  {
    id: 'opipiouiouiuyoiuo',
    title: 'Fist task',
    description: 'Description of the first task. It should be very long to test card behavior. The long string should clamp to 2 lines with 3 dots',
  },
  {
    id: 'qwewqeqweqweqw',
    title: 'Second task',
    description: 'Description of the second task',
  },
]

@Component({
  selector: 'app-tasks',
  imports: [Search, TaskCard],
  templateUrl: './tasks.html',
})
export class Tasks {
  tasks = signal<Task[]>(tasks)

  onSearch(queryString: string) {
    console.log(queryString)
  }
}
