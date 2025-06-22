export interface IProductCategory {
  id: number;
  name: string;
  googleIcon: string;
}

export interface IProduct {
  id: number;
  internalCode: string;
  name: string;
  description: string;
  category: IProductCategory;
  estimatedCostPrice: number;
  currentStock: number;
  stockAlert: number;
  status: boolean;
  observations: string;
}

export interface IGetAllProductsQuery {
  pageNumber: number;
  pageSize:   number;
  name?:      string;
  code?:      string;
}

export interface ICreateProduct {
  internalCode: string;
  name: string;
  description: string;
  categoryId: number;
  estimatedCostPrice: number;
  currentStock: number;
  stockAlert: number;
  status: boolean;
  observations: string;
}

export interface IUpdateProduct {
  internalCode: string;
  name: string;
  description: string;
  categoryId: number;
  estimatedCostPrice: number;
  currentStock: number;
  stockAlert: number;
  status: boolean;
  observations: string;
}
