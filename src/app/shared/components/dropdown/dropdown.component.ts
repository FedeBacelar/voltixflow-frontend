import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {IFilterOption} from "../../models/filterOption";

@Component({
  selector: 'app-dropdown',
  standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

  @Input() options:IFilterOption[] = []
  @Output() selected:EventEmitter<string> = new EventEmitter<string>()

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  isOpen = false;
  selectedLabel = 'Filtrar por';

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: IFilterOption) {
    this.selectedLabel = option.label;
    this.selected.emit(this.selectedLabel)
    this.isOpen = false;
  }

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleDropdown();
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = this.dropdownRef?.nativeElement?.contains(target);

    if (!clickedInside) {
      this.isOpen = false;
    }
  }
}
