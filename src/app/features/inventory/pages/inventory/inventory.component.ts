import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {IDropOption} from "../../../../shared/models/filterOption";
import {SearchFilterComponent} from "../../../../shared/components/search-filter/search-filter.component";
import {IGetAllProductsQuery, IProduct} from "../../../../shared/models/product.model";
import {ProductApiService} from "../../../../core/services/product-api.service";
import {NgForOf, NgIf} from "@angular/common";
import {ProductItemComponent} from "../../components/product-item/product-item.component";
import {ProductCreateModalComponent} from "../../components/product-create-modal/product-create-modal.component";
import {ProductEditModalComponent} from "../../components/product-edit-modal/product-edit-modal.component";
import {HasPermissionDirective} from "../../../../shared/directives/has-permission.directive";

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    SearchFilterComponent,
    NgForOf,
    ProductItemComponent,
    ProductCreateModalComponent,
    ProductEditModalComponent,
    NgIf,
    HasPermissionDirective
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements AfterViewInit, OnDestroy{
  @ViewChild('productListBottom', { static: true })
  productsListBottom!: ElementRef<HTMLElement>;
  @ViewChild('listContainer') listContainerRef!: ElementRef<HTMLDivElement>;

  public products: IProduct[] = [];
  private pageSize   = 5;
  private pageNumber = 1;

  private readonly destroy$ = new Subject<void>();
  private sentinelObserver?: IntersectionObserver;

  public filterOptions:IDropOption[] = [
    { label: 'Nombre', value: '' },
    { label: 'Codigo', value: '' }
  ]

  private filterByName:string = '';
  private filterByCode:string = '';

  private forceGet:boolean = false;

  productSelected:IProduct | undefined = undefined;
  openCreateModal:boolean = false;

  constructor(private productApiService: ProductApiService) {}

  ngAfterViewInit() {
    this.sentinelObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) this.loadPage();
    });
    this.sentinelObserver.observe(this.productsListBottom.nativeElement);
  }

  private hasVerticalScroll(): boolean {
    const el = this.listContainerRef.nativeElement;
    return el.scrollHeight > el.clientHeight;
  }

  private loadPage() {
    const query: IGetAllProductsQuery = {
      pageNumber: this.pageNumber++,
      pageSize:   this.pageSize,
      name:this.filterByName,
      code: this.filterByCode
    };
    this.productApiService.getAllProducts(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe(page => {
        this.products.push(...page);
        setTimeout(() => {
          if ((!this.hasVerticalScroll() && page.length != 0) || this.forceGet) {
            this.loadPage();
          }
        }, 0);
      });
  }

  filterEvent(filter:IDropOption){
    this.filterByName = '';
    this.filterByCode = '';
    switch (filter.label){
      case 'Nombre':
        this.filterByName = filter.value
        break;
      case 'Codigo':
        this.filterByCode = filter.value
        break;
    }
    this.resetProductList();
  }

  resetProductList(){
    this.openCreateModal = false;
    this.pageNumber = 1;
    this.products = [];
    this.loadPage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.sentinelObserver) {
      this.sentinelObserver.disconnect();
    }
  }
}
