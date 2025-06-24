import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IProduct} from "../../../../shared/models/product.model";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {

  @Input() product!:IProduct
  @Output() edit:EventEmitter<IProduct> = new EventEmitter<IProduct>()

  constructor() {
  }

}
