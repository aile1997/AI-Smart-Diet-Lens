import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-background-light p-6">
       <header className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-900">
             <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex gap-1">
             <div className="h-1.5 w-8 rounded-full bg-primary"></div>
             <div className="h-1.5 w-2 rounded-full bg-slate-200"></div>
             <div className="h-1.5 w-2 rounded-full bg-slate-200"></div>
          </div>
       </header>

       <div className="mb-8">
          <span className="text-primary font-bold text-sm tracking-wider uppercase mb-1 block">Step 2 of 4</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Body Metrics</h1>
          <p className="text-slate-500">We use the Mifflin-St Jeor formula for clinical accuracy to determine your metabolic baseline.</p>
       </div>

       <div className="relative w-full bg-white rounded-2xl p-6 shadow-sm mb-8 border border-slate-100 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <span className="material-symbols-outlined text-[100px] text-primary rotate-12">local_fire_department</span>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                <span className="material-symbols-outlined text-[16px]">bolt</span> LIVE PREVIEW
             </div>
             <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">1,640</span>
                <span className="text-sm font-medium text-slate-500">kcal/day</span>
             </div>
             <p className="text-sm font-medium text-slate-400">Basal Metabolic Rate (BMR)</p>
          </div>
       </div>

       {/* Simplified Wheel Picker Visual */}
       <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col">
          <div className="grid grid-cols-3 w-full pt-6 pb-2 border-b border-slate-50 bg-white z-20">
             <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Height</div>
             <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Weight</div>
             <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Age</div>
          </div>
          
          <div className="relative flex-1 grid grid-cols-3">
             <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-14 bg-primary/10 rounded-xl border border-primary/20 pointer-events-none z-10"></div>
             
             {/* Height Col */}
             <div className="flex flex-col items-center justify-center gap-4 opacity-80">
                <span className="text-slate-300 text-lg">173</span>
                <span className="text-slate-400 text-xl">174</span>
                <span className="text-slate-900 text-2xl font-bold">175 <span className="text-sm font-normal text-slate-400">cm</span></span>
                <span className="text-slate-400 text-xl">176</span>
                <span className="text-slate-300 text-lg">177</span>
             </div>
             {/* Weight Col */}
             <div className="flex flex-col items-center justify-center gap-4 border-x border-slate-50 opacity-80">
                <span className="text-slate-300 text-lg">68</span>
                <span className="text-slate-400 text-xl">69</span>
                <span className="text-slate-900 text-2xl font-bold">70 <span className="text-sm font-normal text-slate-400">kg</span></span>
                <span className="text-slate-400 text-xl">71</span>
                <span className="text-slate-300 text-lg">72</span>
             </div>
             {/* Age Col */}
             <div className="flex flex-col items-center justify-center gap-4 opacity-80">
                <span className="text-slate-300 text-lg">26</span>
                <span className="text-slate-400 text-xl">27</span>
                <span className="text-slate-900 text-2xl font-bold">28</span>
                <span className="text-slate-400 text-xl">29</span>
                <span className="text-slate-300 text-lg">30</span>
             </div>
          </div>
       </div>

       <div className="mt-6">
          <button onClick={() => navigate('/home')} className="w-full h-14 bg-primary text-background-dark font-bold text-lg rounded-xl shadow-glow hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
             Continue <span className="material-symbols-outlined">arrow_forward</span>
          </button>
       </div>
    </div>
  );
};

export default Onboarding;