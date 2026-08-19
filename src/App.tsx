import React, { useState, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { Calculators } from './components/Calculators';
import { AiProjectAssistant } from './components/AiProjectAssistant';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { SavedQuotesModal } from './components/SavedQuotesModal';
import { UserAccountModal } from './components/UserAccountModal';
import { Footer } from './components/Footer';

import { INITIAL_PRODUCTS } from './data/products';
import {
  Product,
  CartItem,
  Category,
  FilterOptions,
  SavedQuote,
  UserProfile,
  UserAddress,
  OrderHistoryItem,
} from './types';
import { Building2 } from 'lucide-react';

const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr-vance-construction',
  name: 'Alex Vance',
  email: 'alex@vanceconstruction.ng',
  companyName: 'Vance Infrastructure Ltd',
  phone: '0803 382 9102',
  licenseNumber: 'RC-1092831 / SONCAP',
  role: 'General Contractor',
  net30CreditLimit: 50000000,
  creditUsed: 12450000,
  savedAddresses: [
    {
      id: 'addr-lekki-site',
      label: 'Main Jobsite - Lekki Peninsula Phase 1',
      recipientName: 'Alex Vance (Site Director)',
      recipientPhone: '0803 382 9102',
      street: 'Plot 14 Admiralty Way, Lekki Phase 1',
      city: 'Lekki / Lagos',
      state: 'Lagos State',
      zipCode: '101233',
      isDefault: true,
      notes: 'Flatbed crane drop zone near Gate 2',
    },
    {
      id: 'addr-ikeja-hub',
      label: 'Ikeja Central Yard & Warehouse',
      recipientName: 'Marcus Brody (Supply Chain Manager)',
      recipientPhone: '0802 829 1029',
      street: 'Plot 88 Industrial Avenue, Ikeja',
      city: 'Ikeja',
      state: 'Lagos State',
      zipCode: '100271',
      isDefault: false,
    },
    {
      id: 'addr-abuja-site',
      label: 'Abuja Commercial Plaza Site',
      recipientName: 'Sarah Lin (Project Engineer)',
      recipientPhone: '0805 918 2039',
      street: '310 Central Business District',
      city: 'Abuja',
      state: 'FCT Abuja',
      zipCode: '900211',
      isDefault: false,
    },
  ],
  orders: [
    {
      orderId: 'BTH-921048',
      date: '2026-08-05',
      status: 'Dispatched',
      jobsiteName: 'Main Jobsite - Lekki Peninsula Phase 1',
      items: [
        { product: INITIAL_PRODUCTS[0], quantity: 10 }, // Steel I-Beams
        { product: INITIAL_PRODUCTS[2], quantity: 100 }, // Dangote Cement
      ],
      subtotal: 12500000.0,
      discountTotal: 1250000.0,
      freightFee: 120000.0,
      tax: 843750.0,
      grandTotal: 12213750.0,
      shippingAddress: {
        id: 'addr-lekki-site',
        label: 'Main Jobsite - Lekki Peninsula Phase 1',
        recipientName: 'Alex Vance',
        recipientPhone: '0803 382 9102',
        street: 'Plot 14 Admiralty Way, Lekki Phase 1',
        city: 'Lekki / Lagos',
        state: 'Lagos State',
        zipCode: '101233',
        isDefault: true,
      },
      poNumber: 'PO-2026-9081',
      paymentMethod: 'invoice_net30',
      trackingNumber: 'TRK-BOOM-992014',
      estimatedDelivery: '2026-08-10',
    },
    {
      orderId: 'BTH-810932',
      date: '2026-07-28',
      status: 'Delivered',
      jobsiteName: 'HQ Yard & Distribution Hub',
      items: [
        { product: INITIAL_PRODUCTS[2], quantity: 100 }, // 2x6 Timber
        { product: INITIAL_PRODUCTS[3], quantity: 80 }, // Type X Gypsum
      ],
      subtotal: 2950.0,
      discountTotal: 295.0,
      freightFee: 0.0,
      tax: 221.25,
      grandTotal: 2876.25,
      shippingAddress: {
        id: 'addr-long-beach',
        label: 'HQ Yard & Distribution Hub',
        recipientName: 'Marcus Brody',
        recipientPhone: '(555) 829-1029',
        street: '880 Harbor Industrial Rd',
        city: 'Long Beach',
        state: 'CA',
        zipCode: '90802',
        isDefault: false,
      },
      poNumber: 'PO-2026-7712',
      paymentMethod: 'invoice_net30',
      trackingNumber: 'TRK-FLAT-110293',
      estimatedDelivery: '2026-07-30',
    },
  ],
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // ASTM A36 Steel Beam
      quantity: 2,
      customNote: 'East Warehouse Framing',
    },
    {
      product: INITIAL_PRODUCTS[1], // Portland Cement
      quantity: 25,
      customNote: 'Slab Footing Mix',
    },
  ]);

  // User account state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_DEMO_USER);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  const [zipCode, setZipCode] = useState<string>('Lagos (Ikeja / Lekki)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Drawer / Modals
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [quotesOpen, setQuotesOpen] = useState<boolean>(false);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([
    {
      id: 'QUOTE-884210',
      createdAt: '2026-08-08',
      title: 'Lekki Commercial Slab Takeoff',
      items: [
        { product: INITIAL_PRODUCTS[0], quantity: 5 },
        { product: INITIAL_PRODUCTS[2], quantity: 60 },
      ],
      subtotal: 1085000,
      discountTotal: 108500,
      estimatedFreight: 120000,
      grandTotal: 1096500,
      status: 'Approved',
    },
  ]);

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: '',
    category: 'All',
    brand: 'All Brands',
    minPrice: 0,
    maxPrice: 500000,
    inStockOnly: false,
    selectedSpecs: {},
    sortBy: 'featured',
  });

  // Section Refs for smooth scrolling
  const calculatorRef = useRef<HTMLDivElement>(null);
  const aiAssistantRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const handleScrollToCalculators = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAiAssistant = () => {
    aiAssistantRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auth Operations
  const handleLogin = (email: string) => {
    if (email.toLowerCase().includes('vance')) {
      setCurrentUser(INITIAL_DEMO_USER);
    } else {
      // Create clean new profile
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        companyName: `${email.split('@')[0].toUpperCase()} Contracting`,
        phone: '(555) 234-5678',
        role: 'General Contractor',
        net30CreditLimit: 25000,
        creditUsed: 0,
        savedAddresses: [
          {
            id: `addr-${Date.now()}`,
            label: 'Main Project Site',
            recipientName: email.split('@')[0],
            recipientPhone: '(555) 234-5678',
            street: '100 Commercial Blvd',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            isDefault: true,
          },
        ],
        orders: [],
      };
      setCurrentUser(newUser);
    }
  };

  const handleRegister = (
    userData: Omit<UserProfile, 'id' | 'savedAddresses' | 'orders' | 'net30CreditLimit' | 'creditUsed'>
  ) => {
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now()}`,
      net30CreditLimit: 50000,
      creditUsed: 0,
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Primary Yard Location',
          recipientName: userData.name,
          recipientPhone: userData.phone,
          street: '500 Logistics Way',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          isDefault: true,
        },
      ],
      orders: [],
    };
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddAddress = (addressData: Omit<UserAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    let updatedAddresses = [...currentUser.savedAddresses];
    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddr);
    setCurrentUser({
      ...currentUser,
      savedAddresses: updatedAddresses,
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      savedAddresses: currentUser.savedAddresses.filter((a) => a.id !== addressId),
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      savedAddresses: currentUser.savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      })),
    });
  };

  const handleOrderCompleted = (order: OrderHistoryItem) => {
    if (!currentUser) return;
    const newCreditUsed =
      order.paymentMethod === 'invoice_net30'
        ? currentUser.creditUsed + order.grandTotal
        : currentUser.creditUsed;

    setCurrentUser({
      ...currentUser,
      creditUsed: newCreditUsed,
      orders: [order, ...currentUser.orders],
    });
  };

  const handleReorder = (items: CartItem[]) => {
    setCartItems(items);
    setCartOpen(true);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, note?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          customNote: note || updated[existingIndex].customNote,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, customNote: note }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSaveQuote = (quote: SavedQuote) => {
    setSavedQuotes((prev) => [quote, ...prev]);
  };

  const handleLoadQuoteToCart = (quote: SavedQuote) => {
    setCartItems(quote.items);
    setCartOpen(true);
  };

  // ENHANCED PRODUCT FILTER & SEARCH LOGIC INCLUDING SPECIFICATIONS
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category check
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (filterOptions.category !== 'All' && p.category !== filterOptions.category) return false;

        // Brand check
        if (filterOptions.brand !== 'All Brands' && p.brand !== filterOptions.brand) return false;

        // Comprehensive keyword search (Names, Categories, Brands, Description & Specifications)
        const query = searchQuery.toLowerCase().trim();
        if (query) {
          const matchesName = p.name.toLowerCase().includes(query);
          const matchesCategory = p.category.toLowerCase().includes(query);
          const matchesBrand = p.brand.toLowerCase().includes(query);
          const matchesDesc = p.description.toLowerCase().includes(query);
          // Check specifications object values (e.g., "ASTM A36", "600V", "Sch 40", "5800 PSI")
          const specValuesString = Object.values(p.specifications || {}).join(' ').toLowerCase();
          const matchesSpecs = specValuesString.includes(query);

          if (!matchesName && !matchesCategory && !matchesBrand && !matchesDesc && !matchesSpecs) {
            return false;
          }
        }

        // Key Specification Dropdown filters (Material / Grade, Dimensions, Rating)
        if (filterOptions.selectedSpecs) {
          const specsObj = p.specifications || {};
          const specString = (Object.values(specsObj).join(' ') + ' ' + p.description).toLowerCase();

          for (const [key, filterVal] of Object.entries(filterOptions.selectedSpecs)) {
            if (!filterVal) continue;
            const valStr = String(filterVal);
            const term = valStr.toLowerCase().replace('all materials', '').replace('all dimensions', '').replace('all ratings', '').trim();
            if (term && !specString.includes(term)) {
              return false;
            }
          }
        }

        // Price check
        if (p.price > filterOptions.maxPrice) return false;

        // Stock check
        if (filterOptions.inStockOnly && !p.inStock) return false;

        return true;
      })
      .sort((a, b) => {
        if (filterOptions.sortBy === 'price-asc') return a.price - b.price;
        if (filterOptions.sortBy === 'price-desc') return b.price - a.price;
        if (filterOptions.sortBy === 'rating') return b.rating - a.rating;
        if (filterOptions.sortBy === 'discount') {
          const maxA = Math.max(...a.bulkDiscount.map((t) => t.discountPercent), 0);
          const maxB = Math.max(...b.bulkDiscount.map((t) => t.discountPercent), 0);
          return maxB - maxA;
        }
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, filterOptions, searchQuery]);

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotalSum = cartItems.reduce((sum, item) => {
    const applicableDiscountTier = item.product.bulkDiscount
      .slice()
      .reverse()
      .find((tier) => item.quantity >= tier.threshold);
    const discount = applicableDiscountTier ? applicableDiscountTier.discountPercent : 0;
    const unitPrice = item.product.price * (1 - discount / 100);
    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        cartCount={cartTotalCount}
        cartTotal={cartTotalSum}
        onOpenCart={() => setCartOpen(true)}
        onOpenQuotes={() => setQuotesOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        currentUser={currentUser}
        onScrollToCalculators={handleScrollToCalculators}
        onScrollToAiAssistant={handleScrollToAiAssistant}
        zipCode={zipCode}
        onChangeZipCode={setZipCode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <HeroBanner
          onBrowseAll={handleScrollToCatalog}
          onOpenCalculator={handleScrollToCalculators}
          onOpenAiAssistant={handleScrollToAiAssistant}
        />

        {/* Product Catalog Section - Front & Center */}
        <div ref={catalogRef} className="pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Direct Building Materials
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedCategory === 'All' ? 'Building Materials Catalog' : `${selectedCategory}`}
              </h2>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
            onResetFilters={() => {
              setFilterOptions({
                searchQuery: '',
                category: 'All',
                brand: 'All Brands',
                minPrice: 0,
                maxPrice: 500000,
                inStockOnly: false,
                selectedSpecs: {},
                sortBy: 'featured',
              });
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            totalResults={filteredProducts.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 my-6 space-y-3 shadow-sm">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No matching building materials found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting a different category or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setFilterOptions({
                    searchQuery: '',
                    category: 'All',
                    brand: 'All Brands',
                    minPrice: 0,
                    maxPrice: 500000,
                    inStockOnly: false,
                    selectedSpecs: {},
                    sortBy: 'featured',
                  });
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Interactive Jobsite Material Calculators */}
        <div ref={calculatorRef}>
          <Calculators products={products} onAddToCart={handleAddToCart} />
        </div>

        {/* AI Project Materials Takeoff Advisor */}
        <div ref={aiAssistantRef}>
          <AiProjectAssistant
            products={products}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setCartOpen(true)}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-Overs */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSaveQuote={handleSaveQuote}
        zipCode={zipCode}
        currentUser={currentUser}
        onOrderCompleted={handleOrderCompleted}
      />

      <SavedQuotesModal
        isOpen={quotesOpen}
        onClose={() => setQuotesOpen(false)}
        savedQuotes={savedQuotes}
        onLoadQuoteToCart={handleLoadQuoteToCart}
      />

      <UserAccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onAddAddress={handleAddAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
        onReorder={handleReorder}
      />
    </div>
  );
}
