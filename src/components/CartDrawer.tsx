import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  FileText,
  Check,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  CartItem,
  DeliveryMethod,
  SavedQuote,
  UserProfile,
  OrderHistoryItem,
} from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSaveQuote: (quote: SavedQuote) => void;
  zipCode: string;
  currentUser: UserProfile | null;
  onOrderCompleted?: (order: OrderHistoryItem) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSaveQuote,
  zipCode,
  currentUser,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const defaultAddr =
    currentUser?.savedAddresses.find((a) => a.isDefault) ||
    currentUser?.savedAddresses[0];

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'invoice_net30' | 'wire_transfer'>('credit_card');

  const [jobsiteName, setJobsiteName] = useState(defaultAddr?.label || 'Main Project Site');
  const [address, setAddress] = useState(defaultAddr?.street || 'Plot 14 Admiralty Way, Lekki Phase 1');
  const [city, setCity] = useState(defaultAddr?.city || 'Lagos');
  const [stateCode, setStateCode] = useState(defaultAddr?.state || 'Lagos State');
  const [contactName, setContactName] = useState(currentUser?.name || 'Site Manager');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '0803 123 4567');
  const [poNumber, setPoNumber] = useState(`PO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [completedOrderId, setCompletedOrderId] = useState('');

  // Subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const applicableDiscountTier = item.product.bulkDiscount
      .slice()
      .reverse()
      .find((tier) => item.quantity >= tier.threshold);
    const discount = applicableDiscountTier ? applicableDiscountTier.discountPercent : 0;
    const itemPrice = item.product.price * (1 - discount / 100);
    return sum + itemPrice * item.quantity;
  }, 0);

  const rawSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalSavings = rawSubtotal - subtotal;

  const freightCosts: Record<DeliveryMethod, number> = {
    standard: subtotal > 1000000 ? 0 : 35000,
    flatbed_crane: 95000,
    express_pickup: 0,
    freight_semi: 150000,
  };

  const freightFee = freightCosts[deliveryMethod];
  const tax = Math.round(subtotal * 0.075); // 7.5% VAT
  const grandTotal = subtotal + freightFee + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `BTH-${Math.floor(100000 + Math.random() * 900000)}`;
    setCompletedOrderId(orderId);

    const newOrder: OrderHistoryItem = {
      orderId,
      date: new Date().toISOString().split('T')[0],
      status: 'Dispatched',
      jobsiteName: jobsiteName || 'Jobsite Location',
      items: [...cartItems],
      subtotal,
      discountTotal: totalSavings,
      freightFee,
      tax,
      grandTotal,
      shippingAddress: {
        id: `addr-${Date.now()}`,
        label: jobsiteName,
        recipientName: contactName,
        recipientPhone: contactPhone,
        street: address,
        city,
        state: stateCode,
        zipCode: '100001',
        isDefault: false,
      },
      poNumber: poNumber || undefined,
      paymentMethod,
      trackingNumber: `TRK-VAN-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: 'Within 24-48 Hours',
    };

    if (onOrderCompleted) {
      onOrderCompleted(newOrder);
    }

    setCheckoutStep('confirmation');
  };

  const handleSaveAsQuote = () => {
    const newQuote: SavedQuote = {
      id: `QUOTE-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      title: `${jobsiteName || 'Jobsite'} Material Takeoff`,
      items: [...cartItems],
      subtotal,
      discountTotal: totalSavings,
      estimatedFreight: freightFee,
      grandTotal,
      status: 'Approved',
    };
    onSaveQuote(newQuote);
    alert('Quote saved to your account successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-base text-slate-900">
              {checkoutStep === 'cart' && `Shopping Cart (${cartItems.length})`}
              {checkoutStep === 'checkout' && 'Checkout & Jobsite Dispatch'}
              {checkoutStep === 'confirmation' && 'Order Confirmed!'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-all cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-700 text-sm">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore our certified cement, structural steel rebar, timber, and roofing catalog.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 bg-white flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ₦{item.product.price.toLocaleString()} / {item.product.unit}
                        </div>
                        {item.customNote && (
                          <div className="text-[10px] text-orange-600 truncate mt-0.5">
                            Note: {item.customNote}
                          </div>
                        )}
                      </div>

                      {/* Quantity + Price */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          ₦{(item.product.price * item.quantity).toLocaleString()}
                        </span>

                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Delivery Selection */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Select Delivery Method
                    </label>
                    <div className="space-y-2 text-xs">
                      {[
                        {
                          id: 'standard',
                          title: 'Standard Flatbed Delivery',
                          desc: 'Delivered in 24-48 hrs. Offloaded by site crew.',
                          fee: subtotal > 1000000 ? 0 : 35000,
                        },
                        {
                          id: 'flatbed_crane',
                          title: 'Heavy Boom Crane Offloading',
                          desc: 'Hydraulic crane offload directly to upper floors / yard.',
                          fee: 95000,
                        },
                        {
                          id: 'express_pickup',
                          title: 'Self Depot Pickup (Ikeja / Lekki)',
                          desc: 'Ready for loading within 2 hours at central hub.',
                          fee: 0,
                        },
                      ].map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setDeliveryMethod(m.id as DeliveryMethod)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            deliveryMethod === m.id
                              ? 'bg-orange-50 border-orange-500 text-orange-950 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <span className="font-bold block text-xs">{m.title}</span>
                            <span className="text-[10px] text-slate-500">{m.desc}</span>
                          </div>
                          <span className="font-mono font-bold text-xs">
                            {m.fee === 0 ? 'FREE' : `₦${m.fee.toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-slate-900">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Bulk Tier Savings</span>
                      <span className="font-mono">-₦{totalSavings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Freight</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {freightFee === 0 ? 'FREE' : `₦${freightFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%)</span>
                    <span className="font-mono font-semibold text-slate-900">
                      ₦{tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="font-mono text-orange-600">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAsQuote}
                    className="py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    title="Save Quote"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="text-orange-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                ← Back to Cart Items
              </button>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Jobsite Delivery Address</h3>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project / Site Name</label>
                  <input
                    type="text"
                    required
                    value={jobsiteName}
                    onChange={(e) => setJobsiteName(e.target.value)}
                    placeholder="e.g. Lekki Phase 1 Commercial Plaza"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot 14 Admiralty Way"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">Payment Option</h3>

                <div className="space-y-2">
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                      paymentMethod === 'credit_card'
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="accent-orange-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-900">Debit / Credit Card (Paystack & Flutterwave)</span>
                      <span className="text-[10px] text-slate-500">Instant secure card payment</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                      paymentMethod === 'invoice_net30'
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'invoice_net30'}
                      onChange={() => setPaymentMethod('invoice_net30')}
                      className="accent-orange-500"
                    />
                    <div>
                      <span className="font-bold block text-slate-900">Corporate Net-30 Invoicing</span>
                      <span className="text-[10px] text-slate-500">Pay within 30 days of site delivery</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between text-sm font-black text-slate-900">
                <span>Total Due:</span>
                <span className="text-orange-600 font-mono">₦{grandTotal.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 cursor-pointer transition-all"
              >
                Place Order & Dispatch Materials
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER CONFIRMATION */}
        {checkoutStep === 'confirmation' && (
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Order Dispatched Successfully!</h3>
            <p className="text-xs text-slate-600 max-w-xs">
              Your order <strong className="text-slate-900 font-mono">#{completedOrderId}</strong> has been logged. Our dispatch team is preparing your building materials for delivery.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl w-full text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <strong className="text-slate-900">{jobsiteName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="text-slate-800">{contactName} ({contactPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grand Total:</span>
                <strong className="text-orange-600 font-mono">₦{grandTotal.toLocaleString()}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                onClearCart();
                setCheckoutStep('cart');
                onClose();
              }}
              className="w-full py-3 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
