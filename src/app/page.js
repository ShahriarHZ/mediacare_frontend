"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const stats = [
  { label: "Verified Doctors", value: "50+", color: "text-teal-600" },
  { label: "Patients Served", value: "10,000+", color: "text-cyan-600" },
  { label: "Specializations", value: "20+", color: "text-teal-600" },
  { label: "Success Rate", value: "98%", color: "text-cyan-600" },
];

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    // Fetch featured doctors
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctors?limit=3`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors || []);
        setLoadingDoctors(false);
      })
      .catch(() => {
        setDoctors([]);
        setLoadingDoctors(false);
      });

    // Fetch latest patient reviews
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/latest`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  return (
    <div className="bg-slate-50/50 min-h-screen">
      
      {/* --- HERO BANNER SECTION --- */}
      <div className="relative bg-gradient-to-b from-teal-50/30 to-white min-h-[calc(100vh-68px)] flex items-center py-12 lg:py-0">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Typography Block */}
            <div className="col-span-1 lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 order-2 lg:order-1">
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-800 border border-teal-100/80 shadow-sm tracking-wide">
                Trusted Healthcare Platform
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight max-w-xl lg:max-w-none">
                Your Health, <br className="hidden sm:inline" /> Our <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Priority</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-md sm:max-w-lg md:max-w-xl font-medium leading-relaxed">
                Connect with top doctors, book appointments online, and manage your healthcare journey seamlessly with MediCare Connect.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/doctors" 
                  className="btn btn-md bg-teal-600 hover:bg-teal-700 active:scale-95 border-none text-white font-bold px-8 rounded-xl shadow-md shadow-teal-600/10 transition-all w-full sm:w-auto"
                >
                  Find a Doctor
                </Link>
                <Link 
                  href="/login" 
                  className="btn btn-md btn-outline border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold px-8 rounded-xl active:scale-95 transition-all w-full sm:w-auto"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Interactive Image Frame */}
            <div className="col-span-1 lg:col-span-6 order-1 lg:order-2 flex justify-center items-center w-full">
              <div className="relative w-full max-w-md md:max-w-xl lg:max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100/50 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Clinical Practitioner Portal Workspace" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-slate-50/60 border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                <p className={`text-3xl md:text-4xl font-black ${s.color} tracking-tight`}>{s.value}</p>
                <p className="text-slate-500 font-semibold text-xs md:text-sm mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED DOCTORS SECTION --- */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">Featured Practitioners</h2>
            <p className="text-slate-500 font-medium mt-2">Book consultations with highly rated and verified specialists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingDoctors ? (
              // Loading State Skeletons
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse shadow-sm">
                  <div className="h-44 bg-slate-100 rounded-2xl w-full"></div>
                  <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              // Active Database Render Cards
              doctors.map((doctor) => (
                <div key={doctor._id} className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img 
                      src={doctor.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80"} 
                      alt={doctor.doctorName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-teal-700 flex items-center gap-1 shadow-sm">
                      ⭐ {doctor.rating || "5.0"}
                    </span>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{doctor.specialization}</span>
                    <h3 className="text-lg font-black text-slate-800 mt-1 mb-2 group-hover:text-teal-600 transition-colors">
                      {doctor.doctorName}
                    </h3>
                    
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-50 pt-4 mt-auto">
                      <span>Exp: <b className="text-slate-700">{doctor.experienceYears || "0"}+ Years</b></span>
                      <span>Fee: <b className="text-teal-600">${doctor.appointmentFee || "0"}</b></span>
                    </div>

                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="btn btn-sm bg-slate-50 hover:bg-teal-600 border border-slate-100 hover:border-teal-600 text-slate-700 hover:text-white font-bold rounded-xl mt-4 w-full transition-all"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/doctors" className="btn btn-outline border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 font-bold px-8 rounded-xl transition-all">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">How It Works</h2>
            <p className="text-slate-500 font-medium mt-2">Three basic operational checkpoints to receive modern medical assistance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {[
              { step: "01", title: "Find a Doctor", desc: "Filter by active specializations, locations, and fee ranges seamlessly." },
              { step: "02", title: "Book & Pay", desc: "Select an available checkup time slot and pay securely via Stripe encryption." },
              { step: "03", title: "Get Treated", desc: "Attend your scheduled consultation profile and receive verified digital prescriptions." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center relative group">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 font-black flex items-center justify-center text-xl shadow-sm border border-teal-100/50 mb-4 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium mt-2 max-w-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REVIEWS SECTION --- */}
      {reviews.length > 0 && (
        <section className="py-20 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <h2 className="text-3xl font-black text-center text-slate-800 tracking-tight sm:text-4xl mb-12">What Patients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex gap-0.5 text-amber-400 mb-3 text-sm">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </div>
                    <p className="text-slate-600 font-medium text-sm italic leading-relaxed">"{r.comment}"</p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-50 pt-4 mt-4">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs uppercase">
                      {r.patientName?.charAt(0) || "P"}
                    </div>
                    <p className="font-bold text-xs text-slate-800">{r.patientName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;