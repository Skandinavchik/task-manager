import { Component } from '@angular/core'
import { Search } from '../search/search'

@Component({
  selector: 'app-tasks',
  imports: [Search],
  templateUrl: './tasks.html',
})
export class Tasks {

  onSearch(queryString: string) {
    console.log(queryString)
  }
}
