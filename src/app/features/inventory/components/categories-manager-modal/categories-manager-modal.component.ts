import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalContainerComponent} from "../../../../shared/components/modal-container/modal-container.component";
import {IProductCategory} from "../../../../shared/models/product.model";
import {CategoryItemComponent} from "./category-item/category-item.component";
import {NgForOf} from "@angular/common";
import {ProductApiService} from "../../../../core/services/product-api.service";

@Component({
  selector: 'app-categories-manager-modal',
  standalone: true,
  imports: [
    ModalContainerComponent,
    CategoryItemComponent,
    NgForOf
  ],
  templateUrl: './categories-manager-modal.component.html',
  styleUrl: './categories-manager-modal.component.scss'
})
export class CategoriesManagerModalComponent implements OnInit{

  @Output() close = new EventEmitter<void>();

  categories:IProductCategory[] = []
  googleIcons: string[] = [
    'adf_scanner',
    'computer',
    'kitchen',
    'smartphone',
    'tv',
    'desktop_windows',
    'laptop',
    'tablet_android',
    'headphones',
    'watch',
    'camera_alt',
    'microwave',
    'blender',
    'coffee_maker',
    'speaker',
    'router',
    'print',
    'gamepad',
    'iron',
    'lightbulb',
    'monitor',
    'radio',
    'toys',
    'videogame_asset'
  ];

  constructor(private productApiService:ProductApiService) {
  }

  ngOnInit() {
    this.loadProductCategories()
  }

  private loadProductCategories(): void {
    this.productApiService.getAllProductCategories()
      .subscribe({
        next: (options: IProductCategory[]) => this.categories = options,
        error: err => console.error('Error al cargar categorías', err)
      });
  }

  closeModal(): void {
    this.close.emit();
  }

  onSave(previousCategory: IProductCategory, categoryToCreate: IProductCategory) {
    this.productApiService.createCategory(categoryToCreate).subscribe({
      next: (categoryCreated: IProductCategory) => {
        const index = this.categories.indexOf(previousCategory);
        if (index !== -1) {
          this.categories[index] = {
            ...categoryCreated,
            isNew: false
          };
        }
      },
      error: err => console.error('Error al crear categoria', err)
    });
  }

  onUpdate(previousCategory:IProductCategory, categoryUpdated:IProductCategory){
    if(!previousCategory.id) return
    this.productApiService.updateCategory(previousCategory.id, categoryUpdated).subscribe({
      next: (categoryCreated: IProductCategory) => {
        const index = this.categories.indexOf(previousCategory);
        if (index !== -1) {
          this.categories[index] = {
            ...categoryCreated,
            isNew: false
          };
        }
      },
      error: err => console.error('Error al modificar categoria', err)
    });
  }

  onDelete(categoryId:number){
    this.productApiService.deleteCategory(categoryId).subscribe({
      next: (deleted:boolean) => {
        if(deleted) this.categories = this.categories.filter((category:IProductCategory) => category.id != categoryId)
      },
      error: err => console.error('Error al borrar categoria', err)
    });
  }

  addCategory(){
    this.categories.push({googleIcon: '', name: '', isNew:true})
  }

}
