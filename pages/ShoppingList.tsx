import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShoppingList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light pb-24">
       <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-100">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100">
             <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900">智能买菜清单</h1>
          <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100">
             <span className="material-symbols-outlined">share</span>
          </button>
       </header>

       <main className="flex-1 px-4 py-6 space-y-6">
          {/* AI Banner */}
          <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 p-4 flex gap-4">
             <div className="absolute top-3 right-3 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="size-1.5 bg-primary rounded-full animate-pulse"></span> AI Generated
             </div>
             <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-1">本周食谱汇总</h2>
                <p className="text-sm text-slate-500 mb-2">基于您的代谢分析推荐</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                   <span>7 道菜谱</span> <span className="size-1 bg-slate-300 rounded-full"></span> <span>24 种食材</span>
                </div>
             </div>
             <div className="size-24 rounded-lg bg-slate-100 shrink-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-rUgoT9SdQ31qo5WeYhiQY50kDqe6Z4CgBoSnxP1vg0jnSrQ24NMn215aR3n73zj_AZuujqBKCiyONOc2eBqL0C5XR4Ur-1QgiYyeqP1eV1-NMgB3knNLR--UE_BKDEQassySLP7PiSp3tY1RevsRlEPx4pe2OrSb4jXCuX3EhyrVryYgs9hrQC7bZDNYr9Qhzoj8PVLs-WcmN2Q5l7wy1qIAlHjwe0f3coZGpb5hD6_O3KBcnHEIKr7C3lEalZgckWp2kiUyd5LW")'}}></div>
          </div>

          {/* List Categories */}
          {[
            {
               title: '蔬菜 (Vegetables)', count: '4 items', icon: 'nutrition', color: 'text-green-600 bg-green-100',
               items: [
                  { n: '菠菜', d: '200g · 推荐有机', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1X02S5RxEmXRZF06eNl2v4APmE01f9-ZIIdwjGOD2ElBhsTUlMiO8WfKkiZMODMHlO3x7iiqE_hqcJpQmrpqIEZqGcMSYNP0T0OPN0tq19v9Vq33U6XxllLLfIInqIIQzVy1sr5-cSMpbpiEjGXh2M4iPOxY73KnUfxWqxtWM8PL19u2hGloBx9QxN6457nNjT2cH7e4cfQC6QPcj7gEORAABhrQ5MHmhT7-kayr2P4adgdNG22GrNOjVfI5tZ6Wv9KAi4Vk2LYp4' },
                  { n: '西兰花', d: '1 个 (约 400g)', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBht0HduNndBWeHLwsM0eR3BEEcE9dKZNwLVyevJ7ookc5HiYESNDl3a20lXan2tHOk7_AXEw1EO3ZgKbV-ae0sorCBMK5gCz5u5ekRTFyd0XpvNCCUeVFDl3oGxBdRYfPH44pFaBANYWAphM6JRofb3Z3sphXKc_BRacGbkl9e9i39Q53infcxzKFOYmrhmFEPHvQLKkLrkUmSP1pBJUel-tWy7ejHXhEoJiP8iSG-zANDy9EvW417UUdMHXj2srC5gorgRleFUOk5' }
               ]
            },
            {
               title: '蛋白质 (Proteins)', count: '2 items', icon: 'egg_alt', color: 'text-orange-600 bg-orange-100',
               items: [
                  { n: '鸡胸肉', d: '500g · 低脂', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpvDnAqtNuyG9GcfGv-GaWNpG6Ka_Rmg24frLI-FWHw1RcIwz1xPa1QBCm30X5Xa1nfKpkPmi2J4ghAXg0SRPuvso2RH2_gUMx0qzc7mnP25U_v2YYTlBtPQXm5MMFOb8frZHPu2TWvOVPJBpnDGFNr1uqkVpxZmDAilJlQrXSvSLB8hOu1oiisX6evw5l0SuYzQ89IrDVqHNRRzU96QpY4esPTGqh2RwBSVC4LlRNOljFaNIEMFfkNScIU1EFQf03YNzVUgpFpx2H' },
                  { n: '鲜鸡蛋', d: '6 枚 · 可生食', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-GfzZ9ylX1O_W3AJChOys08uOub1OTD484GsTg_UJjs_EwTp2bn72dkIF3a9E2M0697n3BFKXVR-a5v-tmCqUE5nuhwHyVbWdWvAF6gZUqVJCFlGzc7yrbV1eNornMqIGcysfmXNeZeNZXa8jCTsNZHE3wJRk6iFzvoKrtSp0i0BufTuuudIzwmDtGASapzyuuR5smem8562iW8Icq03gZh14_CmeFsZukdaoe6WH9yUJHtZprKQVX13TprBjq8MXy4aARz2MK_Pc' }
               ]
            }
          ].map((cat, idx) => (
             <div key={idx} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                   <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                      <span className={`size-8 rounded-full flex items-center justify-center ${cat.color}`}>
                         <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      </span>
                      {cat.title}
                   </h3>
                   <span className="text-xs font-medium text-slate-400">{cat.count}</span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                   {cat.items.map((item, i) => (
                      <label key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer">
                         <div className="flex items-center gap-4">
                            <img src={item.img} className="size-14 rounded-lg object-cover bg-slate-100" alt={item.n} />
                            <div>
                               <p className="font-bold text-slate-900">{item.n}</p>
                               <p className="text-sm text-slate-500">{item.d}</p>
                            </div>
                         </div>
                         <input type="checkbox" className="size-6 rounded-full border-2 border-slate-300 text-primary focus:ring-0 cursor-pointer" />
                      </label>
                   ))}
                </div>
             </div>
          ))}
       </main>

       {/* Floating Cart Action */}
       <div className="fixed bottom-24 left-0 right-0 max-w-lg mx-auto px-4 z-40">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white p-2 pr-3 rounded-2xl flex items-center justify-between shadow-2xl">
             <div className="pl-4">
                <span className="text-xs text-slate-400 block">预估总价</span>
                <span className="text-xl font-bold font-display">¥ 128.50</span>
             </div>
             <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                <span className="material-symbols-outlined">shopping_cart_checkout</span>
                一键下单
             </button>
          </div>
       </div>
    </div>
  );
};

export default ShoppingList;