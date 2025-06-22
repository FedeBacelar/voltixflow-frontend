import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgForOf, NgIf } from "@angular/common";
import { IDropOption } from "../../models/filterOption";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {

  @Input() set initialText(text:string){
    this.selectedLabel = text
    this.defaultText = text
  }

  defaultText:string = 'Seleccionar';

  @Input() options: IDropOption[] = [];

  @Output() selected: EventEmitter<IDropOption> = new EventEmitter<IDropOption>();

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  isOpen = false;
  selectedLabel = 'Seleccionar';
  isDisabled = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    const match = this.options.find(opt => opt.value === value);
    this.selectedLabel = match ? match.label : this.defaultText;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.isDisabled) return;
    this.isOpen = !this.isOpen;
  }

  selectOption(option: IDropOption): void {
    if (this.isDisabled) return;
    this.selectedLabel = option.label;
    this.onChange(option.value);
    this.onTouched();
    this.selected.emit(option);
    this.isOpen = false;
  }

  onDropdownClick(event: MouseEvent): void {
    if (this.isDisabled) return;
    event.stopPropagation();
    this.toggleDropdown();
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = this.dropdownRef?.nativeElement?.contains(target);
    if (!clickedInside) this.isOpen = false;
  }
}
