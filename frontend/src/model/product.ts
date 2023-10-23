import { Category } from "./category";

export interface Product {
  _id?: string;
  name: string;
  image: string;
  slug: string;
  category: Category;
  classify: string;
  description: string;
  price: number;
  isActive: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cart {
  product: Product;
  quantity: number;
  classify: string;
}
