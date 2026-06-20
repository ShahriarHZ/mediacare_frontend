"use client";

const AboutPage = () => {
  return (
    <div className="bg-slate-50/50 min-h-screen py-16 md:py-24 text-slate-800">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        
        {/* --- Header Section --- */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            About <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">MediCare Connect</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
            Bridging the gap between patients and healthcare providers through innovative technology.
          </p>
        </div>

        {/* --- Our Mission Section (Two Column Layout) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-20 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          
          {/* Left Column: Image */}
          <div className="col-span-1 lg:col-span-5 w-full">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80" 
                alt="Medical practitioner consulting patient" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="col-span-1 lg:col-span-7 space-y-4 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Mission
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              MediCare Connect was founded with a singular vision: to make quality healthcare accessible to everyone. We believe that no one should struggle to find the right doctor or wait endlessly for an appointment.
            </p>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              Our platform leverages cutting-edge technology to streamline the healthcare experience, from searching verified doctors to booking appointments and managing medical records securely.
            </p>
          </div>

        </div>

        {/* --- Core Values Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Mission */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 text-xl font-bold shadow-inner">
              🎯
            </div>
            <h3 className="text-lg font-black text-slate-900">Mission</h3>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
              To democratize healthcare access by connecting patients with verified doctors through a seamless digital platform.
            </p>
          </div>

          {/* Card 2: Vision */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 text-xl font-bold shadow-inner">
              👁️
            </div>
            <h3 className="text-lg font-black text-slate-900">Vision</h3>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
              A world where quality healthcare is just a click away, with zero barriers to accessing medical expertise.
            </p>
          </div>

          {/* Card 3: Values */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 text-xl font-bold shadow-inner">
              🏅
            </div>
            <h3 className="text-lg font-black text-slate-900">Values</h3>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
              Trust, transparency, and patient-centered care guide every decision we make at MediCare Connect.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;