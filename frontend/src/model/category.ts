import exp from "constants";
import { Product } from "./product";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  child: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export interface Order {
  _id: string;
  user: User;
  products: {
    product: Product;
    quantity: number;
    classify: string;
  }[];
  total: number;
  name: string;
  note: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
