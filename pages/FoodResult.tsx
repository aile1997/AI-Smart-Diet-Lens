import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FoodResult: React.FC = () => {
  const navigate = useNavigate();
  const [portion, setPortion] = useState(250);

  return (
    <div className="relative h-screen w-full flex flex-col bg-background-light">
      {/* Top Image Area */}
      <div className="relative h-[40vh] w-full shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4okC0hHdn3KHTuhDrx6xp8mDEkn5jbe7BZiwHFYNGahUNYOKaU-P-wp4QPUaoE_-BCukvONG3Sae8E0mfPO3Y_06RQNmL_7k9xY0yDEjb9STqrajykm7h_P-GJy90l1QKgmPIELcCu7QWIpKcVFjc2MXU46MW4pZAX078eN02KA6KUebKHDU54pfwir8U9sU5ic4ki7-QYykkUCwsS62DQoA5oakcMbvNAQx_f69msJTTsiOE_gZU36fX8O86ZT3UGhSn1MTjx7GG")'}}>
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
        
        <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-10">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white/20 backdrop-blur-md text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button className="flex items-center gap-2 px-4 h-10 rounded-full bg-white/20 backdrop-blur-md text-white">
             <span className="material-symbols-outlined text-[20px]">photo_camera</span>
             <span className="text-sm font-semibold">重拍</span>
          </button>
        </div>

        <div className="absolute bottom-10 left-6 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-black uppercase tracking-wider">AI 置信度 98%</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-sm font-display">香煎三文鱼<br/>蔬菜沙拉碗</h2>
        </div>
      </div>

      {/* Detail Sheet */}
      <div className="flex-1 relative -mt-8 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col z-20">
         <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
           <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
         </div>
         
         <div className="flex-1 overflow-y-auto px-6 pt-2 pb-28">
            <div className="flex items-end justify-between mb-8">
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">总热量</p>
                 <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight font-display">450 <span className="text-2xl font-semibold text-slate-400 ml-1">kcal</span></h1>
               </div>
               <div className="text-right pb-1">
                 <div className="flex items-center gap-1 justify-end text-primary font-bold">
                   <span className="material-symbols-outlined text-sm">check_circle</span>
                   <span>健康</span>
                 </div>
                 <p className="text-xs text-slate-400">在日常目标内</p>
               </div>
            </div>

            {/* Slider */}
            <div className="mb-8 p-5 bg-background-light rounded-2xl border border-slate-100">
               <div className="flex justify-between items-center mb-4">
                 <label className="text-base font-bold text-slate-900">分量大小</label>
                 <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                   <span className="font-bold text-slate-900">{portion}</span>
                   <span className="text-sm font-medium text-slate-400">g</span>
                 </div>
               </div>
               <input 
                 type="range" 
                 min="50" 
                 max="500" 
                 value={portion} 
                 onChange={(e) => setPortion(Number(e.target.value))}
                 className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
               />
               <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                 <span>50g</span>
                 <span>500g</span>
               </div>
            </div>

            {/* Macros List */}
            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-slate-500">宏量营养素</h3>
              
              <div className="group">
                 <div className="flex justify-between items-end mb-2">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-primary"></span>
                     <span className="font-semibold text-slate-700">蛋白质</span>
                   </div>
                   <div className="text-right">
                     <span className="text-lg font-bold text-slate-900">35g</span>
                     <span className="text-xs font-medium text-slate-400 ml-1">/ 140g</span>
                   </div>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                   <div className="bg-primary h-full rounded-full" style={{width: '31%'}}></div>
                 </div>
              </div>

              <div className="group">
                 <div className="flex justify-between items-end mb-2">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                     <span className="font-semibold text-slate-700">碳水</span>
                   </div>
                   <div className="text-right">
                     <span className="text-lg font-bold text-slate-900">12g</span>
                     <span className="text-xs font-medium text-slate-400 ml-1">/ 250g</span>
                   </div>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                   <div className="bg-amber-400 h-full rounded-full" style={{width: '10%'}}></div>
                 </div>
              </div>

               <div className="group">
                 <div className="flex justify-between items-end mb-2">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                     <span className="font-semibold text-slate-700">脂肪</span>
                   </div>
                   <div className="text-right">
                     <span className="text-lg font-bold text-slate-900">18g</span>
                     <span className="text-xs font-medium text-slate-400 ml-1">/ 70g</span>
                   </div>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                   <div className="bg-sky-400 h-full rounded-full" style={{width: '25%'}}></div>
                 </div>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 my-8"></div>

            <div className="grid grid-cols-3 gap-4 pb-4">
              <div className="bg-background-light p-3 rounded-xl text-center border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">钠</p>
                <p className="font-bold text-slate-900">450mg</p>
              </div>
              <div className="bg-background-light p-3 rounded-xl text-center border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">膳食纤维</p>
                <p className="font-bold text-slate-900">6.2g</p>
              </div>
              <div className="bg-background-light p-3 rounded-xl text-center border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">糖</p>
                <p className="font-bold text-slate-900">3.1g</p>
              </div>
            </div>
         </div>

         {/* Sticky Footer */}
         <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
            <button 
              onClick={() => navigate('/diary')}
              className="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold text-lg h-14 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>保存到日记</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default FoodResult;