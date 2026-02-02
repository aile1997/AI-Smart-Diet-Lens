import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Scan: React.FC = () => {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Simulate identification delay
    const timer = setTimeout(() => {
      setScanned(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Background Camera Feed (Simulated) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP9ZqyvoNOkfUKn5kUom1CwhefOCGiIdSYFYymfFT1VUmw6O-k3omUWe5luc3WeEs-uBCmKtQLsTg9IQUkb8xHVOQ56ozg4Bawg1pQQlmj5rbvHS-AfoduqbnrupeBU1FNX3owz6befdRHYWoSgOlr-sLcpQ56f2KWbRzjXJ-VhuvxilFUGTrGIqZ9IF8h1_Vfe_BM05yXui0Ce61rsDJ8s_CMrdJuhmJTLq1siOmcBk7hCVEmEOxTQ8D2IlzGIoiDE4377mGFAy63" 
          className="w-full h-full object-cover opacity-90"
          alt="Camera Feed"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex flex-col h-full justify-between py-12 px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex gap-4">
            <button className="flex items-center justify-center size-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
              <span className="material-symbols-outlined">flash_on</span>
            </button>
          </div>
        </div>

        {/* Reticle Area */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 ${scanned ? 'opacity-0' : 'opacity-100'}`}>
          <div className="relative size-72">
             <div className="absolute w-full h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(56,224,123,0.8)] animate-[scan_2s_linear_infinite] z-10 top-0"></div>
             {/* Reticle Corners */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
             <div className="absolute inset-4 border border-white/20 rounded-lg"></div>
          </div>
          <p className="mt-6 text-white font-bold tracking-widest text-sm drop-shadow-md animate-pulse">正在识别...</p>
        </div>

        {/* Result Card (Slides Up) */}
        {scanned && (
          <div className="w-full bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <div className="flex items-center gap-1.5 mb-1 text-primary">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    <span className="text-xs font-bold uppercase tracking-wider">识别成功</span>
                 </div>
                 <h2 className="text-slate-900 text-2xl font-bold">牛油果吐司</h2>
                 <p className="text-slate-500 text-sm font-medium">健康脂肪来源</p>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-3xl font-extrabold text-primary">320</span>
                 <span className="text-xs text-slate-500 font-bold uppercase">kcal</span>
               </div>
            </div>
            {/* Macros */}
            <div className="grid grid-cols-3 gap-3 mb-6">
               <div className="flex flex-col gap-1.5">
                 <div className="flex justify-between items-end">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">蛋白质</span>
                   <span className="text-xs font-bold text-slate-900">12g</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-400 rounded-full w-[40%]"></div>
                 </div>
               </div>
               <div className="flex flex-col gap-1.5">
                 <div className="flex justify-between items-end">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">碳水</span>
                   <span className="text-xs font-bold text-slate-900">24g</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full w-[65%]"></div>
                 </div>
               </div>
               <div className="flex flex-col gap-1.5">
                 <div className="flex justify-between items-end">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">脂肪</span>
                   <span className="text-xs font-bold text-slate-900">18g</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-400 rounded-full w-[55%]"></div>
                 </div>
               </div>
            </div>
            <button onClick={() => navigate('/result')} className="w-full py-4 bg-primary text-slate-900 font-bold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
               <span className="material-symbols-outlined">add_circle</span>
               确认并添加
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;