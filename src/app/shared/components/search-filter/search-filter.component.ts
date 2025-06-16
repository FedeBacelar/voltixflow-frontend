import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DropdownComponent} from "../dropdown/dropdown.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IFilterOption} from "../../models/filterOption";

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    DropdownComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent {

  @Output() filter:EventEmitter<IFilterOption> = new EventEmitter<IFilterOption>()
  @Input() filterOptions:IFilterOption[] = [];

  selectedFilter: IFilterOption = {label: '', value: ''};

  onFilterSelected(filterBy: string) {
    if(filterBy != this.selectedFilter.label){
      this.selectedFilter.value = '';
      this.selectedFilter.label = filterBy;
      this.filter.emit(this.selectedFilter);
    }
  }

  search() {
    if(this.selectedFilter.label) this.filter.emit(this.selectedFilter);
  }

}
