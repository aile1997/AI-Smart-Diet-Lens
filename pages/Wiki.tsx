import React from 'react';
import { useNavigate } from 'react-router-dom';

const Wiki: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
         <div className="flex items-center justify-between px-6 pt-12 pb-4">
            <div>
               <p className="text-xs font-bold text-primary tracking-widest uppercase">Smart-Diet Lens</p>
               <h1 className="text-2xl font-bold text-slate-900">AI 食材百科</h1>
            </div>
            <div className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
               <span className="material-symbols-outlined text-slate-600">person</span>
            </div>
         </div>
         {/* Search */}
         <div className="px-6 pb-4">
            <div className="relative">
               <span className="absolute left-4 top-3.5 text-slate-400 material-symbols-outlined">search</span>
               <input type="text" placeholder="搜索食材、功效 (如：抗氧化)..." className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 pl-12 pr-12 focus:ring-primary focus:border-primary" />
               <span className="absolute right-4 top-3.5 text-slate-400 material-symbols-outlined">mic</span>
            </div>
         </div>
         {/* Filters */}
         <div className="flex gap-3 px-6 pb-4 overflow-x-auto no-scrollbar">
            <button className="px-5 py-2 rounded-full bg-primary text-white font-bold text-sm shadow-glow shrink-0">全部</button>
            {['⚡️ 超级食物', '💪 优质蛋白', '📉 低GI', '🥕 维生素'].map(t => (
               <button key={t} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-medium text-sm shrink-0 whitespace-nowrap">{t}</button>
            ))}
         </div>
      </div>

      <main className="flex-1 px-6 pt-6 space-y-8 overflow-y-auto no-scrollbar">
         {/* Seasonal Section */}
         <section>
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-900">当季 AI 推荐</h2>
               <div className="flex items-center gap-1 text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-sm">calendar_month</span> SEASONAL
               </div>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
               {/* Card 1 */}
               <div className="snap-center shrink-0 w-72 h-48 relative rounded-2xl overflow-hidden shadow-card group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDejXUH1BDXEER9F3FELKud7iUO2KZ17RgJNrY4lDkBhH6Tc-u3bNIYyRX91RiuaPOa4I7wLJvn6ZUSSmnhptpgGJWgUy1pMWSHcxRkbWu65p9oHvIJk_e7cqKWSNSDfevoIE_bSJifkE_AMUrRxghzYnjTlZv07HY2OSH-10MW9ENvQf0j3PD7NWS0Uv_gzq-Ieqr8QVH5oTOAe5OysgaFENlD31regyrBhJ67q22tef3bWB41TtKa_NW5dYKxf5jURrpnZrWZzf7E" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Avocado" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1">
                     <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                     <span className="text-xs font-bold">98分</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                     <h3 className="text-lg font-bold text-white mb-1">牛油果 (Avocado)</h3>
                     <div className="flex gap-2">
                        <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-bold">优质脂肪</span>
                     </div>
                  </div>
               </div>
               {/* Card 2 */}
               <div className="snap-center shrink-0 w-72 h-48 relative rounded-2xl overflow-hidden shadow-card group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtDm4ZjOk45gKnLqrSyl18-u_ix9MGrFYxCQiVwzgo2AUJMw6ss2Z52uY5fDyJa2xBipdL0gY1_AvQmYyBCK9fgHtWeviyM3CmmbXBlzxTKBWRWuuL8GrNTDKs2s78Oh0O_4DYsR8VjWWRLExZzmS-xUqQXVW5bubUsCVBZ5I6dkrWxgZfE2f9qsXKeIAxlMq4cb5sLmQ2hdTHSczrJJi-2uRgj_g79pA9yjqjVLN2owINHy5RLiLvGxolQEy56yEsvu9VtzrPdBg3" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Salmon" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1">
                     <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                     <span className="text-xs font-bold">95分</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                     <h3 className="text-lg font-bold text-white mb-1">深海三文鱼</h3>
                     <div className="flex gap-2">
                        <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">Omega-3</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Grid List */}
         <section>
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-900">食材列表</h2>
               <button className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500">
                  排序 <span className="material-symbols-outlined text-sm">sort</span>
               </button>
            </div>
            <div className="grid grid-cols-2 gap-4 pb-6">
               {[
                 { name: '土鸡蛋', sub: '全蛋白来源', score: 94, tags: ['AI 小贴士'], desc: '建议水煮控制在 8 分钟内。', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZEvgua3_rMOGa0OylbPtsG-yB1s_8OHCZxsEST06iY-IP8bR4N7LRQ-HiFpXY2oND-UdOXiPHb7cARuyJGHit4a7LnLWg-_iAk9aL4V3bPpqw9hwKF7174DgpYk0ZuZNgPe4HtnyJiIBFhGRvcQl10VxeorChMg8qgakFhfVAM7oeGJa-uItNLPmmQYXNmIJttaxsPdvwg4KihNu5cpbxQiTH4zqIScn9uTX9luc1o2hCIo0jQ5Etx-xAEATzm7dC5nrxuAH3hphA' },
                 { name: '野生蓝莓', sub: '花青素之王', score: 88, tags: ['抗氧化', '低糖'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9vgDOQ4BdB-gds4ceL23WIpsqJRuBUuK9l6hzg0OGzU-B9IWcWmIuG2pOY2P1u1hGd64edy_CUXqTBYr7op9WVHIbAZcB08PlgWFbqHFy86MAPj7sH_WdnTp7QnOFx3vXRWhkxHv-zklLOs4DwI3ddwLWupcsgOZiEn_WRghc68hBBHyFJUG5h77v1W_qbw5RfZt6ytFY8VArMsijfDFmiUJtV7cIYO6ZB3n3gZAR1xBWmchy33KrPHTADD05B1WrIeetriFy7iT' },
                 { name: '奇亚籽', sub: '超级食物', score: 96, tags: ['AI 小贴士'], desc: '需浸泡 10 分钟激活胶质。', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0yzc3cWm8uQmrgASYcHb5nHNijPeRaODHRVXS4wKNUHHr9eFkMZrYqp2B9fYm4PYYFnwjh1OtO7Tw6U2whTV2IYrSt-oiS9nQcyLA3KpRIdNiu_yF2acQXlxU2gbwahh9RNSdW2S2lXIXt6N83QW8xGolfbWg89-f5rBjITCYa7sAFYvH7Hxo53UUhhow0Lj0EzYHB2wSs7asscrnB8ZFYx98N89Pq4f4tVZ-huL6ex3tmk-M8sg4ufaS36D9dRaed72UHXwvQfMS' },
                 { name: '羽衣甘蓝', sub: '维生素K之王', score: 92, tags: ['高纤维', '排毒'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXUV-xiVHMPWSTmkIKfwT35kSoWU1qwQN3MGj4P-FgTk5GK6IeoU9hBcoLs369Tn_98uBhs_AKkrjs6ZKdJ84Vk9Kt1CV3TffaD7Xr4nxQbURfmO546cPKE1kPEGIu-iMc03tzLbomopQ-nWLZMcobgVhYBGEpK26wC0Gezm2yc3fmVml8drTJnF8Ze-vId86BM605eq7cw4LOf41tOETtECswDlk679f54m6dlBE05IaUOtX6JvLzb7amsK2IlZ2tfUzah4WX2NfU' }
               ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3 shadow-card border border-slate-100 group">
                     <div className="relative aspect-[4/3] mb-3 rounded-xl overflow-hidden bg-slate-100">
                        <img src={item.img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={item.name} />
                        <div className="absolute bottom-2 right-2 size-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
                           {item.score}
                        </div>
                     </div>
                     <h3 className="font-bold text-slate-900">{item.name}</h3>
                     <p className="text-xs text-slate-500 mb-2">{item.sub}</p>
                     {item.desc ? (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                           <div className="flex items-center gap-1 text-primary text-[10px] font-bold mb-0.5">
                              <span className="material-symbols-outlined text-sm">lightbulb</span> AI 小贴士
                           </div>
                           <p className="text-[10px] text-slate-600">{item.desc}</p>
                        </div>
                     ) : (
                        <div className="flex gap-1">
                           {item.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{t}</span>)}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </section>
      </main>
    </div>
  );
};

export default Wiki;