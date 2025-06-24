import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IDropOption } from "../../models/filterOption";

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

  @Output() filter = new EventEmitter<IDropOption>();
  @Input() filterOptions: IDropOption[] = [];

  selectedFilter: IDropOption = { label: '', value: '' };

  onFilterSelected(option: IDropOption): void {
    if (option.label !== this.selectedFilter.label) {
      this.selectedFilter = { ...option, value: '' };
      this.filter.emit(this.selectedFilter);
    }
  }

  search(): void {
    if (this.selectedFilter.label) {
      this.filter.emit(this.selectedFilter);
    }
  }
}
