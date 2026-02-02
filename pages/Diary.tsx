import React from 'react';
import { useNavigate } from 'react-router-dom';

const Diary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background-light/95 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between p-4">
           <button onClick={() => navigate('/home')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200">
             <span className="material-symbols-outlined text-slate-900">arrow_back</span>
           </button>
           <h2 className="text-lg font-bold text-slate-900">每日饮食日记</h2>
           <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200">
             <span className="material-symbols-outlined text-slate-900">calendar_month</span>
           </button>
        </div>
        {/* Week Strip */}
        <div className="flex justify-between px-4 pb-4 overflow-x-auto no-scrollbar gap-2">
           {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map((day, idx) => {
             const active = idx === 2; // Active Tuesday
             const date = 22 + idx;
             return (
               <div key={idx} className="flex flex-col items-center gap-1 min-w-[3rem]">
                 <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-slate-500'}`}>{day}</span>
                 <button className={`size-10 rounded-full text-sm font-bold flex items-center justify-center ${active ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-700 hover:bg-slate-100'}`}>
                   {date}
                 </button>
               </div>
             )
           })}
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6 overflow-y-auto pb-24">
         {/* Summary Card */}
         <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
           <div className="flex justify-between items-end mb-4">
             <div>
               <p className="text-sm font-medium text-slate-500">今日摄入 (Intake)</p>
               <div className="flex items-baseline gap-2">
                 <h3 className="text-3xl font-extrabold text-slate-900 font-display">1,850</h3>
                 <span className="text-sm font-medium text-slate-400">/ 2,000 kcal</span>
               </div>
             </div>
             <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <span className="material-symbols-outlined">local_fire_department</span>
             </div>
           </div>
           {/* Bars */}
           <div className="grid grid-cols-3 gap-4">
              {[
                { label: '碳水', val: '180g', color: 'bg-blue-400', pct: '75%' },
                { label: '蛋白质', val: '140g', color: 'bg-primary', pct: '90%' },
                { label: '脂肪', val: '55g', color: 'bg-amber-400', pct: '45%' },
              ].map((m, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-slate-600">{m.label}</span>
                     <span className="text-slate-400">{m.val}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full ${m.color} rounded-full`} style={{width: m.pct}}></div>
                   </div>
                </div>
              ))}
           </div>
         </div>

         {/* Meals List */}
         {[
           {
             name: '早餐', color: 'bg-amber-400', cal: '450',
             items: [
               { title: '燕麦蓝莓碗', desc: '1 碗 (300g)', c: 320, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO6lCCNyCr-9sK8fXvaAIhKK7WmSfu9Uf149XcP8lpdAE7f_BzbdZmLZBZG4Zwlja0d_5ogEm6ZDptV3N0fTTbP9ybrY5BuPmBVx8yf_GtKAuf1S68VdZWi-SYUpiNg1zMJhmvcxA6_aPnKiCi5_-8pFr-2Lhsb5JeQwmItG2BBIFIpCBNcfzXjNxTt7wDMpOsdteVu6u3ZDI16VBTRsAdzrKHpFm2bys5YOMMJer-oWLdoYNLTPywsbINHy7tbI2JLXfkO7rPgZQB' },
               { title: '拿铁咖啡', desc: '大杯 (450ml)', c: 130, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt5M38stR6FqJQR6FVvwa3POgLoZ4AtoRLEfY-Aqu3SBFkl4CSbDvCecxJdBlZmN4k_HBRDCzv9puKG1OnWKtZYW4DUqyBeaPhc8vAD9g-pRhEJUTg8cd90wWdnpPSuSbmmRe3nC5Y1ong57pDiVAwwsWLT6qWEzafpbJOXJwdjgQRTEP9E25eUi2KeH02N-DBK8XMyMyF55GUARUXqb6zpK4nshLboc0VsYQTJeqMBx4m573IG5At8a2FKCTnmWhqCCUO1DSmuvre' }
             ]
           },
           {
             name: '午餐', color: 'bg-primary', cal: '680',
             items: [
               { title: '香煎鸡胸肉沙拉', desc: '1 份 (标准)', c: 450, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvDsm7kGmVlIiHWr_NkIXQ9YFLmlFPEwziSugN4FJ46DRT_-Ku_bA-XN3XGyR3mjKbOhhQF20s1VVpKA5Rnf_TO7ZX0kyLeCX-f02wneUKIdc1RYy_-B2pCbk0FdCpovcZKVXqtITwWMtOyyZyw-puf3I4-604wALd51lSx_MH9FDevnhWHHa7sZghPwFbvu9hnTrKXoT9OlFRp0DIpvQ9DAbgjQs3P_L_UZn0ExovrCkqAxCEyEMZuhkyNLFkRDh_6pJSUAlCB8s7' },
               { title: '全麦面包', desc: '2 片', c: 230, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB67183Q-wWAFHmB_ChEEFBvQcBk4BzDWAza0b1C_Yazm1Yq55M0aF9sVna1rs7oqPdavwF5jjOpbvz5WcKEydYhwmf3K7Ox_MotuTDmCVWlt9w1fxmxenqrPB7ZVRXLaDWUf-QjPNmRHFpN0j1fNXETgAxErBe-x3dFr724WgI6BQvgrP1M9NPzHzfgR4lcuXGXv4FgVEQadTnjGMLGwn5JE8izX2quKoZwXwJNIl_HlFPDIbS0w2XN14imv4oIhHl3v_4CpZuBIlS' }
             ]
           },
           {
             name: '晚餐', color: 'bg-indigo-500', cal: '720',
             items: [
               { title: '香煎三文鱼佐芦笋', desc: '1 份 (大)', c: 720, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7oURG6cfuepb1O4bTWBl3Bn685JRLNy3S7zPu71OgxXvi2z00YwITtYUib0t6qd0EM5mfT1lXeQjGqzxHPocPbgjb67zzifnkXBPRpG5_mjif7uybvlSG_1GgabHZTt-i8bc7XEt_-T94VHB1yqaIT5Fi8JgVDMygybJFxHkYi-SKpd9Sv_9mVJfTzIwJqQOfUmLQkSyEO7_YUVR28fE-p0jhY-UiZ7P25rNh1lZlp4f6KlrovQk1vdRFGy5t5Zr3qYd2OW0hWLyr' }
             ]
           }
         ].map((meal, idx) => (
           <div key={idx}>
             <h3 className="text-lg font-bold text-slate-900 pb-3 flex items-center gap-2">
               <span className={`size-2 rounded-full ${meal.color}`}></span> {meal.name}
               <span className="text-xs font-medium text-slate-400 ml-auto bg-slate-100 px-2 py-1 rounded-md">{meal.cal} kcal</span>
             </h3>
             <div className="flex flex-col gap-3">
               {meal.items.map((item, i) => (
                 <div key={i} className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200">
                    <div className="size-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                       <div className="flex justify-between items-start mb-1">
                         <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                         <span className="font-bold text-sm text-slate-900">{item.c}</span>
                       </div>
                       <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                 </div>
               ))}
             </div>
           </div>
         ))}
         
         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 shadow-sm">
            <div className="absolute -top-6 -right-6 text-blue-50">
               <span className="material-symbols-outlined" style={{fontSize: '120px'}}>auto_awesome</span>
            </div>
            <div className="relative z-10 flex flex-col gap-2">
               <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-lg">smart_toy</span>
                  AI 智能分析
               </div>
               <p className="text-slate-600 text-sm leading-relaxed">
                  您的蛋白质摄入非常理想，达到了目标的 110%。但晚餐后的脂肪摄入略高。建议明天早餐增加全麦面包来平衡碳水比例。
               </p>
               <button className="text-sm font-bold text-primary flex items-center gap-1 mt-2">
                  查看详细报告 <span className="material-symbols-outlined text-sm">arrow_forward</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Diary;