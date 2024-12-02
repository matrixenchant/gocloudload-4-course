export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  email: string;
  created_at: string;
  role: string;
  reviews: Review[];
  carts: ShoppingCart[];
  orders: Order[];
}

export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  category_id: number;
  category: Category | null;
  reviews: Review[] | null;
  images: ProductImage[] | null;
}

export interface Category {
  category_id: number;
  name: string;
  description: string;
  products: Product[];
}

export interface Review {
  review_id: number;
  product_id: number;
  product: Product;
  user_id: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  order_date: string;
  status: 'FILLED' | 'PENDING' | 'CANCELLED';
  total_amount: number;
  cart_id: number;
  payment: Payment;
}

export interface ShoppingCart {
  cart_id: number;
  created_at: string;
  user_id: number;
  items: CartItem[] | null;
  order: Order | null;
}

export interface CartItem {
  cart_item_id: number;
  quantity: number;
  product_id: number;
  product: Product;
  cart_id: number;
}

export interface Payment {
  payment_id: number;
  order_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
}

export interface Role {
  role_id: number;
  role_name: string;
}

export interface UserAddress {
  address_id: number;
  user_id: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface ProductImage {
  image_id: number;
  product_id: number;
  image_url: string;
  created_at: string;
}

export interface AuditLog {
  log_id: number;
  action: string;
  user_id: number;
  timestamp: string;
}

export interface Cache {
  cache_key: string;
  cache_value: string;
  expiration_time: string;
}
