import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ConfirmDialogComponent} from "../../../../shared/components/confirm-dialog/confirm-dialog.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ICreateProduct, IProduct, IProductCategory} from "../../../../shared/models/product.model";
import {ProductApiService} from "../../../../core/services/product-api.service";
import {ModalContainerComponent} from "../../../../shared/components/modal-container/modal-container.component";
import {NgIf} from "@angular/common";
import {DropdownComponent} from "../../../../shared/components/dropdown/dropdown.component";
import {IDropOption} from "../../../../shared/models/filterOption";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-product-edit-modal',
  standalone: true,
    imports: [
        ConfirmDialogComponent,
        ModalContainerComponent,
        NgIf,
        DropdownComponent,
        ReactiveFormsModule
    ],
  templateUrl: './product-edit-modal.component.html',
  styleUrl: './product-edit-modal.component.scss'
})
export class ProductEditModalComponent implements OnChanges{

  @Output() close = new EventEmitter<void>();
  @Output() productEdited = new EventEmitter<void>();

  @Input() product!:IProduct

  form!: FormGroup;
  productCategoriesOptions: IDropOption[] = [];
  stateOptions: IDropOption[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  constructor(
    private fb: FormBuilder,
    private productApiService: ProductApiService
  ) {
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

  openDeleteDialog:boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.form.patchValue({
        name: this.product.name,
        internalCode: this.product.internalCode,
        description: this.product.description,
        categoryId: this.product.category.id,
        estimatedCostPrice: this.product.estimatedCostPrice,
        currentStock: this.product.currentStock,
        stockAlert: this.product.stockAlert,
        status: this.product.status,
        observations: this.product.observations,
      });
    }
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
    if (this.form.invalid) return;
    const productData: ICreateProduct = this.form.value;
    this.productApiService.updateProduct(this.product.id, productData).subscribe({
      next: () => {
        this.productEdited.emit();
        this.closeModal();
      },
      error: err => console.error('Error al modificar producto', err)
    });
  }

  deleteProduct(){
    this.productApiService.deleteProduct(this.product.id).subscribe({
      next: () => {
        this.productEdited.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
      }
    })
  }

  closeModal(): void {
    this.close.emit();
  }
}
