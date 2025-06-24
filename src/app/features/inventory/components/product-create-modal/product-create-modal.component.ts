import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ModalContainerComponent } from "../../../../shared/components/modal-container/modal-container.component";
import { ProductApiService } from "../../../../core/services/product-api.service";
import { ICreateProduct, IProductCategory } from "../../../../shared/models/product.model";
import { IDropOption } from "../../../../shared/models/filterOption";
import { map } from "rxjs/operators";
import { NgIf, NgForOf } from "@angular/common";
import { DropdownComponent } from "../../../../shared/components/dropdown/dropdown.component";

@Component({
  selector: 'app-product-create-modal',
  standalone: true,
  imports: [
    ModalContainerComponent,
    ReactiveFormsModule,
    DropdownComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './product-create-modal.component.html',
  styleUrl: './product-create-modal.component.scss'
})
export class ProductCreateModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() productCreated = new EventEmitter<void>();

  form!: FormGroup;

  productCategoriesOptions: IDropOption[] = [];
  stateOptions: IDropOption[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  constructor(
    private fb: FormBuilder,
    private productApiService: ProductApiService
  ) {}

  ngOnInit(): void {
    this.loadProductCategories();
    this.form = this.fb.group({
      name: ['', Validators.required],
      internalCode: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
      estimatedCostPrice: [null, Validators.required],
      currentStock: [null, Validators.required],
      stockAlert: [null, Validators.required],
      status: [true, Validators.required],
      observations: ['']
    });
  }

  private loadProductCategories(): void {
    this.productApiService.getAllProductCategories()
      .pipe(
        map((categories: IProductCategory[]) =>
          categories.map(category => ({ label: category.name, value: category.id }))
        )
      )
      .subscribe({
        next: (options: IDropOption[]) => this.productCategoriesOptions = options,
        error: err => console.error('Error al cargar categorías', err)
      });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const productData: ICreateProduct = this.form.value;
    this.productApiService.createProduct(productData).subscribe({
      next: () => {
        this.productCreated.emit();
        this.closeModal();
      },
      error: err => console.error('Error al crear producto', err)
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}
