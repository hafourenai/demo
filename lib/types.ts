// Types dan Models untuk aplikasi

export type UserRole = 'customer' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Customer extends User {
  addresses: Address[];
  wishlist: string[];
  reviews: Review[];
}

export interface Address {
  id: string;
  label: 'home' | 'office' | 'other';
  recipientName: string;
  phone: string;
  detail: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  isDefault: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  role: string;
  skills: string[];
  rating: number;
  totalJobs: number;
  isActive: boolean;
  currentOrderId?: string;
  commission: number;
  createdAt: Date;
}

export interface ServiceVariation {
  id: string;
  name: string;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number; // in minutes
  image: string;
  rating: number;
  variations: ServiceVariation[];
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  isBestSeller: boolean;
  reviews: Review[];
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  services: string[]; // service IDs
  products: string[]; // product IDs
  normalPrice: number;
  bundlePrice: number;
  image: string;
  discount: number;
}

export interface CartItem {
  id: string;
  type: 'service' | 'product' | 'bundle';
  itemId: string;
  quantity: number;
  variationId?: string;
  price: number;
}

export interface Promo {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'nominal' | 'voucher';
  value: number;
  minTransaction?: number;
  applicableTo: ('service' | 'product' | 'bundle')[];
  applicableItems?: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export type OrderStatus =
  | 'waiting_employee'
  | 'accepted'
  | 'going_to_location'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled_customer'
  | 'cancelled_admin';

export interface Order {
  id: string;
  customerId: string;
  employeeId?: string;
  items: CartItem[];
  address: Address;
  status: OrderStatus;
  totalPrice: number;
  promoId?: string;
  promoDiscount: number;
  paymentMethod: 'cash' | 'transfer' | 'qris';
  paymentStatus: 'pending' | 'success' | 'failed';
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancelReason?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  authorId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_created' | 'employee_found' | 'employee_arrived' | 'order_completed' | 'promo' | 'order_claimed_other';
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: Date;
}
