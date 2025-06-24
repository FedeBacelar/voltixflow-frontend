import {Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IProductCategory} from "../../../../../shared/models/product.model";

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss'
})
export class CategoryItemComponent implements OnInit {

  @Input() iconOptions: string[] = [];
  @Input() item:IProductCategory = { name: '', googleIcon: '', isNew: true };
  @Output() save:EventEmitter<IProductCategory> = new EventEmitter<{ name: string; googleIcon: string }>();
  @Output() update:EventEmitter<IProductCategory> = new EventEmitter<{ name: string; googleIcon: string }>();
  @Output() delete:EventEmitter<number> = new EventEmitter<number>();

  form!: FormGroup;
  originalName = '';
  originalIcon = '';

  showDropdown = false;

  constructor(private fb: FormBuilder, private elementRef: ElementRef) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.item.name, Validators.required],
      googleIcon: [this.item.googleIcon || this.iconOptions[0]]
    });
    this.originalName = this.item.name;
    this.originalIcon = this.item.googleIcon || this.iconOptions[0];
  }

  get isModified(): boolean {
    return (
      this.form.value.name !== this.originalName ||
      this.form.value.googleIcon !== this.originalIcon
    );
  }

  handleAction() {
    if (this.item.isNew) {
      if (this.form.valid) {
        this.save.emit(this.form.value);
      }
    } else {
      if (this.isModified) {
        if (this.form.valid) {
          this.update.emit(this.form.value);
        }
      } else {
        this.delete.emit(this.item.id);
      }
    }
  }

  getIconName(): string {
    if (this.item.isNew) return 'save';
    return this.isModified ? 'save' : 'delete';
  }

  getIconColor(): string {
    if(this.form.invalid) return '#606060'
    if (this.item.isNew) return '#16518C';
    return this.isModified ? '#DB9123' : '#DC3545';
  }

  isInvalid(): boolean {
    return Boolean(this.form.get('name')?.invalid && this.form.get('name')?.touched);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  selectIcon(icon: string) {
    this.form.get('googleIcon')?.setValue(icon);
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

}
