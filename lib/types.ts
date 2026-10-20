// Types dan Models untuk Home Cleaning & Nail Art Commerce Platform (PRD V2)

export type UserRole = 'customer' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  role: UserRole;
  createdAt: Date | string;
}

export interface Customer extends User {
  addresses: Address[];
  wishlist: string[];
  reviews?: Review[];
}

export interface Address {
  id: string;
  label: 'home' | 'office' | 'other';
  recipientName: string;
  phone: string;
  detail: string;
  latitude: number;
  longitude: number;
  notes?: string;
  isDefault: boolean;
}

export interface EmployeePaymentProfile {
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  qrisImageUrl?: string;
  qrisMerchantName?: string;
  isVerified: boolean;
}

export interface Employee extends User {
  role: 'employee';
  specialization: string; // e.g. 'Home Cleaning Specialist'
  skills: string[]; // e.g. ['General Cleaning', 'Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Office Cleaning']
  rating: number;
  totalJobs: number;
  isActive: boolean;
  currentOrderId?: string;
  paymentProfile: EmployeePaymentProfile;
  settlementRate: number; // default 3%
  grossRevenueToday?: number;
  grossRevenueMonth?: number;
}

export interface CleaningService {
  id: string;
  name: string;
  description: string;
  category: 'Home Service' | 'Specialized Cleaning';
  duration: number; // in minutes
  image: string;
  rating: number;
  isAvailable: boolean;
  popularityBadge?: 'Most Popular' | 'Recommended' | 'Best Value';
  checklistTemplate: string[];
}

export interface CleaningAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: string;
}

export interface BasePriceTier {
  minM2: number;
  maxM2: number;
  price: number;
}

export interface PricingRule {
  id: string;
  basePriceTiers: BasePriceTier[];
  pricePerM2Above200: number;
  freeDistanceKm: number;
  pricePerKm: number;
  maxServiceRadiusKm: number;
  serviceFee: number;
  defaultSettlementRate: number; // e.g. 3.0
  version: number;
  updatedAt: Date | string;
}

export interface CleaningPropertyDetails {
  propertyType: 'rumah' | 'apartemen' | 'kos' | 'kantor';
  buildingSize: number; // in m²
  floors: number;
  bedrooms: number;
  bathrooms: number;
}

export type CleaningOrderStatus =
  | 'searching_employee'
  | 'assigned'
  | 'on_the_way'
  | 'arrived'
  | 'in_service'
  | 'completed'
  | 'cancelled_customer'
  | 'cancelled_admin';

export type PaymentMethod = 'cash' | 'qris' | 'transfer';
export type PaymentStatus = 'unpaid' | 'waiting_confirmation' | 'paid';

export interface CleaningChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface CleaningOrder {
  orderType: 'cleaning';
  id: string;
  invoiceNumber: string; // INV-CLN-YYYYMMDD-XXXX
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  employeeId?: string;
  serviceId: string;
  serviceName: string;
  propertyDetails: CleaningPropertyDetails;
  address: Address;
  distanceKm: number;
  addons: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  priceBreakdown: {
    basePrice: number;
    distanceFee: number;
    addonsTotal: number;
    serviceFee: number;
    discount: number;
    total: number;
  };
  status: CleaningOrderStatus;
  bookingType: 'now' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProof?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  checklist: CleaningChecklistItem[];
  liveLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
    etaMinutes: number;
  };
  employeePaymentSnapshot?: EmployeePaymentProfile;
  rating?: number;
  reviewComment?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
  cancelReason?: string;
}

export interface NailArtVariant {
  id: string;
  size?: string; // S, M, L
  color?: string; // Pink, Pearl Nude, Ruby Wine, Glossy Black, etc.
  design?: string; // Minimalist, 3D Floral, Glitz Luxury, French Tip
  sku: string;
  price: number;
  stock: number;
}

export interface NailArtProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  category:
    | 'Press-On Nails'
    | 'Fake Nails'
    | 'Nail Sticker'
    | 'Nail Accessories'
    | 'Nail Tools'
    | 'Nail Polish'
    | 'Gel Nail'
    | 'Nail Care'
    | 'Starter Kit';
  price: number;
  promoPrice?: number;
  image: string;
  rating: number;
  isBestSeller: boolean;
  stock: number;
  variants: NailArtVariant[];
  reviews?: Review[];
}

export type ProductOrderStatus =
  | 'waiting_payment'
  | 'paid'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface ProductOrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ProductOrder {
  orderType: 'product';
  id: string;
  invoiceNumber: string; // INV-PRD-YYYYMMDD-XXXX
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  items: ProductOrderItem[];
  address: Address;
  courierName?: string;
  trackingNumber?: string;
  shippingCost: number;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProof?: string;
  status: ProductOrderStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
}

export type Order = CleaningOrder | ProductOrder;

export interface CartItem {
  id: string;
  type: 'product';
  itemId: string;
  quantity: number;
  variantId?: string;
  price: number;
  productName?: string;
  variantName?: string;
  image?: string;
}

export interface Promo {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'nominal';
  value: number;
  minTransaction?: number;
  applicableTo: ('cleaning' | 'product')[];
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
}

export interface EmployeeSettlement {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // YYYY-MM, e.g. "2026-10"
  grossRevenue: number;
  settlementRate: number; // percentage, e.g. 3.0
  settlementDue: number; // grossRevenue * (settlementRate / 100)
  paidAmount: number;
  remainingAmount: number;
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'waived';
  adjustments: {
    id: string;
    adminId: string;
    amount: number;
    reason: string;
    timestamp: Date | string;
  }[];
  paymentRecords: {
    id: string;
    date: string;
    amount: number;
    method: string;
    proofUrl?: string;
  }[];
}

export interface AuditLog {
  id: string;
  action: string;
  adminId: string;
  details: string;
  timestamp: Date | string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  authorId: string;
  authorName?: string;
  createdAt: Date | string;
}

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'order_created'
    | 'employee_found'
    | 'employee_on_the_way'
    | 'employee_arrived'
    | 'service_started'
    | 'order_completed'
    | 'promo'
    | 'order_claimed_other'
    | 'payment_confirmed'
    | 'product_shipped';
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: Date | string;
}

// Backward compatibility alias for any component still importing Service or Product
export type Service = CleaningService;
export type Product = NailArtProduct;
export type OrderStatus = CleaningOrderStatus | ProductOrderStatus;
