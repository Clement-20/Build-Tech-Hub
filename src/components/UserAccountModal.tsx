import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  Building,
  Plus,
  Trash2,
  Truck,
  LogOut,
  ShieldCheck,
  RotateCcw,
  Printer,
} from 'lucide-react';
import { UserProfile, UserAddress, OrderHistoryItem, CartItem } from '../types';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (email: string) => void;
  onRegister: (userData: Omit<UserProfile, 'id' | 'savedAddresses' | 'orders' | 'net30CreditLimit' | 'creditUsed'>) => void;
  onLogout: () => void;
  onAddAddress: (address: Omit<UserAddress, 'id'>) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
  onReorder: (items: CartItem[]) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  onLogout,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onReorder,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'General Contractor' | 'Subcontractor' | 'Project Manager' | 'Procurement Lead'>('General Contractor');

  // Add address state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');

  // Selected order for invoice view
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderHistoryItem | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    onLogin(loginEmail);
  };

  const handleDemoLogin = () => {
    onLogin('alex@vanceconstruction.com');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regCompany) return;
    onRegister({
      name: regName,
      companyName: regCompany,
      email: regEmail,
      phone: regPhone || '0803 123 4567',
      role: regRole,
      licenseNumber: 'RC-1092831 / SONCAP Certified',
    });
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity) return;
    onAddAddress({
      label: newAddrLabel || 'New Jobsite Location',
      recipientName: newAddrName || (currentUser?.name || 'Site Manager'),
      recipientPhone: currentUser?.phone || '0803 123 4567',
      street: newAddrStreet,
      city: newAddrCity,
      state: 'Lagos State',
      zipCode: '100001',
      isDefault: false,
    });
    setShowAddAddress(false);
    setNewAddrLabel('');
    setNewAddrStreet('');
    setNewAddrCity('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative text-slate-900 border border-slate-200">
        {/* Header */}
        <div className="bg-slate-50 p-5 sm:p-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight flex items-center gap-2">
                {currentUser ? currentUser.companyName : 'Contractor Portal & Account'}
                {currentUser && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Active Account
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                {currentUser
                  ? `${currentUser.name} (${currentUser.role}) • ${currentUser.email}`
                  : 'Log in to manage orders, past invoices, and saved jobsite addresses'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGGED OUT STATE */}
        {!currentUser ? (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 max-w-md mx-auto w-full">
            {/* Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="alex@vanceconstruction.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Sign In
                </button>

                <div className="relative py-2 text-center">
                  <span className="text-[11px] text-slate-400">or</span>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Log In as Demo Contractor (Alex Vance)</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Business Name</label>
                  <input
                    type="text"
                    required
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="Vance Construction Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@vanceconstruction.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md cursor-pointer mt-2"
                >
                  Create Contractor Account
                </button>
              </form>
            )}
          </div>
        ) : (
          /* LOGGED IN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Nav */}
            <div className="w-full md:w-56 bg-slate-50 border-r border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Orders ({currentUser.orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Jobsites ({currentUser.savedAddresses.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Your Order History</h3>

                  {currentUser.orders.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
                      <Package className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500">No orders placed yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentUser.orders.map((order) => (
                        <div
                          key={order.orderId}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {order.orderId}
                              </span>
                              <span className="text-slate-500">{order.date}</span>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                                {order.status}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900 font-mono">
                              ₦{order.grandTotal.toLocaleString()}
                            </span>
                          </div>

                          <div className="text-xs space-y-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-slate-600">
                                <span>{it.quantity}x {it.product.name}</span>
                                <span className="font-mono">₦{(it.product.price * it.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 pt-1 border-t border-slate-200">
                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Invoice</span>
                            </button>
                            <button
                              onClick={() => {
                                onReorder(order.items);
                                onClose();
                              }}
                              className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reorder</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* JOBSITES TAB */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Saved Jobsite Addresses</h3>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Site</span>
                    </button>
                  </div>

                  {showAddAddress && (
                    <form onSubmit={handleCreateAddress} className="p-4 bg-slate-50 rounded-2xl border border-orange-200 space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Site Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lekki Tower Project"
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Address</label>
                        <input
                          type="text"
                          required
                          placeholder="Plot 45 Lekki Expressway"
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-bold"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentUser.savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs"
                      >
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">{addr.street}, {addr.city}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-3 text-xs">
                  <h3 className="text-base font-bold text-slate-900">Business Profile</h3>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div><span className="text-slate-500">Contact:</span> <strong className="text-slate-800">{currentUser.name}</strong></div>
                    <div><span className="text-slate-500">Company:</span> <strong className="text-slate-800">{currentUser.companyName}</strong></div>
                    <div><span className="text-slate-500">Email:</span> <strong className="text-slate-800">{currentUser.email}</strong></div>
                    <div><span className="text-slate-500">Role:</span> <strong className="text-slate-800">{currentUser.role}</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INVOICE POPUP */}
        {selectedInvoiceOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 relative border border-slate-200">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Commercial Tax Invoice</h3>
                <p className="text-xs text-slate-500">BuildTech Hub Central Distribution Depot</p>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Order #: <strong className="font-mono">{selectedInvoiceOrder.orderId}</strong></span>
                  <span>Date: <strong>{selectedInvoiceOrder.date}</strong></span>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 divide-y divide-slate-200">
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <div key={idx} className="py-1 flex justify-between">
                      <span>{it.quantity}x {it.product.name}</span>
                      <span className="font-mono font-bold">₦{(it.product.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="text-right text-xs pt-1">
                  <div className="font-black text-sm text-slate-900">
                    Grand Total: <span className="text-orange-600 font-mono">₦{selectedInvoiceOrder.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
