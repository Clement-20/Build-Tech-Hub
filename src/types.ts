export type Category =
  | 'All'
  | 'Structural Steel'
  | 'Cement & Concrete'
  | 'Lumber & Framing'
  | 'Drywall & Insulation'
  | 'Roofing & Siding'
  | 'Plumbing & Electrical'
  | 'Fasteners & Hardware'
  | 'Heavy Equipment & Tools';

export interface BulkDiscountTier {
  threshold: number; // e.g. 10
  discountPercent: number; // e.g. 10 (%)
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  unit: string;
  bulkDiscount: BulkDiscountTier[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  leadTime: string;
  image: string;
  specifications: Record<string, string>;
  description: string;
  applications: string[];
  certification: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnit?: string;
  customNote?: string;
}

export type DeliveryMethod = 'standard' | 'flatbed_crane' | 'express_pickup' | 'freight_semi';

export interface CheckoutDetails {
  jobsiteName: string;
  address: string;
  city: string;
  zipCode: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryMethod: DeliveryMethod;
  deliveryDate: string;
  gateCodeOrInstructions?: string;
  poNumber?: string;
  paymentMethod: 'credit_card' | 'invoice_net30' | 'wire_transfer';
}

export interface AimaterialEstimate {
  name: string;
  category: Category;
  estimatedQuantity: number;
  unit: string;
  estimatedUnitPrice: number;
  specification: string;
  reason: string;
}

export interface AiProjectResponse {
  summary: string;
  materials: AimaterialEstimate[];
  recommendations: string[];
}

export interface UserAddress {
  id: string;
  label: string; // e.g. "Main Jobsite - Bay 4", "HQ Distribution Yard"
  recipientName: string;
  recipientPhone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  notes?: string;
}

export interface OrderHistoryItem {
  orderId: string;
  date: string;
  status: 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered';
  jobsiteName: string;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  freightFee: number;
  tax: number;
  grandTotal: number;
  shippingAddress: UserAddress;
  poNumber?: string;
  paymentMethod: 'credit_card' | 'invoice_net30' | 'wire_transfer';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone: string;
  licenseNumber?: string;
  role: 'General Contractor' | 'Subcontractor' | 'Project Manager' | 'Procurement Lead';
  net30CreditLimit: number;
  creditUsed: number;
  savedAddresses: UserAddress[];
  orders: OrderHistoryItem[];
}

export interface FilterOptions {
  searchQuery: string;
  category: Category;
  brand: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  selectedSpecs: Record<string, string>; // e.g., { "Grade": "ASTM A36", "Thickness": "5/8 in", "Voltage": "600V" }
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
}

export interface SavedQuote {
  id: string;
  createdAt: string;
  title: string;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  estimatedFreight: number;
  grandTotal: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Dispatched';
}
