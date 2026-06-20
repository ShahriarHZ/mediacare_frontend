"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Description Column */}
        <div className="space-y-3">
          <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-400 p-1 rounded-md text-sm">➕</span> 
            MediCare<span className="text-teal-400">Connect</span>
          </span>
          <p className="text-xs text-slate-400 leading-relaxed">
            A centralized online medical network optimizing automated patient workflows, smart appointment booking pipelines, and encrypted clinical records management.
          </p>
          {/* Social Icons Placeholder */}
          <div className="flex gap-3 pt-2 text-slate-400">
            <a href="#" className="hover:text-teal-400 transition-colors text-sm">🌐 Facebook</a>
            <a href="#" className="hover:text-teal-400 transition-colors text-sm">🐦 Twitter</a>
            <a href="#" className="hover:text-teal-400 transition-colors text-sm">💼 LinkedIn</a>
          </div>
        </div> 
        
        {/* Quick Links Column */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-teal-400 block mb-4">Quick Links</span> 
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-teal-400 hover:underline transition-colors">Home Landing</Link></li>
            <li><Link href="/find-doctors" className="hover:text-teal-400 hover:underline transition-colors">Find Doctors Directory</Link></li>
            <li><Link href="/about" className="hover:text-teal-400 hover:underline transition-colors">About Our Platform</Link></li>
            <li><Link href="/contact" className="hover:text-teal-400 hover:underline transition-colors">Contact Support</Link></li>
          </ul>
        </div> 

        {/* Contact Info Column */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-teal-400 block mb-4">Contact Info</span> 
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span>📍</span> 
              <span>University of Barishal,<br />Barishal, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span> 
              <span className="hover:text-teal-400 transition-colors">support@medicareconnect.io</span>
            </li>
            <li className="flex items-center gap-2">
              <span>🕒</span> 
              <span>Operational Hours: 24/7 Support</span>
            </li>
          </ul>
        </div>

        {/* Assignment Emergency Requirement Column */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-teal-400 block mb-4">Emergency Support</span> 
          <p className="text-3xl font-black text-red-400 tracking-tight drop-shadow-sm">10678</p>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
            Direct nationwide critical-care trauma request routing dispatch center. Available at any hour.
          </p>
        </div>
      </div>

      {/* Lower Copyright Strip */}
      <div className="border-t border-slate-800/60 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} MediCare Connect Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;