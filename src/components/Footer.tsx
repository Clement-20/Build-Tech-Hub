import React from 'react';
import { Building2, ShieldCheck, Truck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">
                Build<span className="text-orange-500">Tech</span> Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certified structural building materials, cement, high-yield steel rebar, and roofing supplies delivered directly to jobsites across Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-xs space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Building Materials</h4>
            <p className="text-slate-400">Dangote & BUA 42.5N Cement</p>
            <p className="text-slate-400">High-Yield Steel Rebar (Y12 - Y25)</p>
            <p className="text-slate-400">Treated Hardwood 2x6 Timber</p>
            <p className="text-slate-400">Aluminum Longspan Roofing Sheets</p>
          </div>

          {/* Services */}
          <div className="text-xs space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Contractor Tools</h4>
            <p className="text-slate-400">Jobsite Concrete Slab Calculator</p>
            <p className="text-slate-400">AI Project Takeoff Estimator</p>
            <p className="text-slate-400">Direct Boom Crane Truck Dispatch</p>
            <p className="text-slate-400">Corporate Net-30 Invoicing</p>
          </div>

          {/* Contact */}
          <div className="text-xs space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Central Depot</h4>
            <p className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Plot 14 Commercial Ave, Ikeja, Lagos</span>
            </p>
            <p className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span>+234 800 284 5348</span>
            </p>
            <p className="flex items-center gap-2 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-orange-500" />
              <span>orders@buildtechhub.ng</span>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} BuildTech Hub Nigeria Ltd. Quality certified materials.</p>
          <div className="flex gap-4">
            <span>Fast Jobsite Delivery</span>
            <span>•</span>
            <span>SONCAP Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
