// src/types/index.ts
export type Role = 'customer' | 'admin' | 'delivery_partner';
export type AddressType = 'home' | 'work' | 'other';
export type ProductType = 'grocery' | 'medical';
export type StorageCondition = 'ambient' | 'chilled' | 'frozen';
export type PrescriptionStatus = 'pending' | 'approved' | 'rejected';
export type CouponDiscountType = 'flat' | 'percent';
export type AppliesToType = 'all' | 'category' | 'product';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'wallet';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
}

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
  taxRate: number;
  productType: ProductType;
  isActive: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: Category;
  brand: string;
  hsnCode: string;
  gstPercent: number;
  mrp: number;
  sellingPrice: number;
  unit: string;
  imageUrls: string[];
  productType: ProductType;
  requiresPrescription: boolean;
  isPerishable: boolean;
  shelfLifeDays?: number;
  storageCondition: StorageCondition;
  manufacturer: string;
  countryOfOrigin: string;
  isActive: boolean;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  product?: Product;
  sku: string;
  size: string;
  priceOverride?: number;
  isDefault: boolean;
  inventories?: Inventory[];
}

export interface Inventory {
  id: string;
  productVariantId: string;
  warehouseId: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
}

export interface Prescription {
  id: string;
  userId: string;
  imageUrl: string;
  doctorName?: string;
  issueDate?: string;
  status: PrescriptionStatus;
  adminRemarks?: string;
  reviewedBy?: string;
  uploadedAt: string;
  reviewedAt?: string;
  user?: {
    name: string;
    phone: string;
  };
}

export interface CartItem {
  id: string;
  cartId: string;
  productVariantId: string;
  productVariant: ProductVariant & { product: Product };
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface DeliverySlot {
  id: string;
  warehouseId: string;
  pincodes: string[];
  deliveryDate: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  currentOrders: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  productName: string;
  brand: string;
  size: string;
  hsnCode: string;
  gstPercent: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  address?: Address;
  orderNumber: string;
  status: OrderStatus;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  prescriptionId?: string;
  couponId?: string;
  deliverySlotId: string;
  deliverySlot?: DeliverySlot;
  notes?: string;
  createdAt: string;
  items?: OrderItem[];
  user?: {
    name: string;
    phone: string;
  };
}

export interface ProductReview {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number;
  reviewText?: string;
  isApproved: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

