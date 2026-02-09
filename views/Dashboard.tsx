import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp, DollarSign, Activity, Wallet, PieChart } from 'lucide-react';
import { Category } from '../types';

export const Dashboard: React.FC = () => {
  const { getTotalBudget, getExecutedAmount, budgetConfig, getExecutedByCategory, expenses } = useBudget();

  const totalBudget = getTotalBudget();
  const executed = getExecutedAmount();
  const balance = totalBudget - executed;
  const percentage = totalBudget > 0 ? (executed / totalBudget) * 100 : 0;

  // Helper to get budget by category enum
  const getBudgetForCategory = (cat: Category) => {
    switch (cat) {
      case Category.MANO_DE_OBRA: return budgetConfig.labor;
      case Category.MATERIALES: return budgetConfig.materials;
      case Category.ACARREOS: return budgetConfig.haulage;
      case Category.ALQUILERES: return budgetConfig.rentals;
      case Category.IMPREVISTOS: return budgetConfig.unforeseen;
      default: return 0;
    }
  };

  // Dynamic Data for Bar Chart
  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    budget: getBudgetForCategory(cat),
    executed: getExecutedByCategory(cat),
  }));

  // Data for Line Chart (Cumulative)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let cumulative = 0;
  const timeData = sortedExpenses.map(exp => {
    cumulative += exp.amount;
    return {
      date: exp.date,
      amount: cumulative,
    };
  });

  // Risk Logic
  const getRiskLevel = (cat: Category) => {
    const budget = getBudgetForCategory(cat);
    const exec = getExecutedByCategory(cat);
    const ratio = budget > 0 ? exec / budget : 0;
    if (ratio > 1) return 'exceeded';
    if (ratio > 0.8) return 'risk';
    return 'ok';
  };

  const alerts = Object.values(Category)
    .map(cat => ({ cat, status: getRiskLevel(cat) }))
    .filter(a => a.status !== 'ok');

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Resumen financiero y estado de obra</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span>En tiempo real</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Presupuesto */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Wallet size={22} />
            </div>
            {/* Decorative dot */}
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Presupuesto Total</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">${totalBudget.toLocaleString()}</h3>
          </div>
        </div>

        {/* Card 2: Ejecutado */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Activity size={22} />
            </div>
             <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Gasto Ejecutado</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">${executed.toLocaleString()}</h3>
          </div>
        </div>

        {/* Card 3: Saldo */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl transition-colors duration-300 ${balance < 0 ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
              <DollarSign size={22} />
            </div>
             <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Saldo Disponible</p>
            <h3 className={`text-3xl font-bold tracking-tight ${balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              ${balance.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Card 4: % Ejecución */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
              <PieChart size={22} />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${percentage > 100 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Avance Presupuestal</p>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section - Sleek Design */}
      {alerts.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 animate-fade-in">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
             <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 text-sm md:text-base">Atención Requerida en Presupuesto</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {alerts.map((alert, idx) => (
                <span key={idx} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${alert.status === 'exceeded' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                  {alert.cat}: {alert.status === 'exceeded' ? 'EXCEDIDO' : '> 80%'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Presupuesto vs. Ejecución</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-200"></div> Presupuesto</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Ejecutado</div>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{fill: '#64748b'}} 
                  interval={0} 
                  dy={10}
                />
                <YAxis 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{fill: '#64748b'}} 
                  tickFormatter={(value) => `$${value/1000}k`} 
                />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="budget" fill="#e2e8f0" radius={[4, 4, 4, 4]} barSize={20} />
                <Bar dataKey="executed" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tendencia de Gasto</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData.length > 0 ? timeData : [{date: 'Inicio', amount: 0}]}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{fill: '#94a3b8'}}
                  minTickGap={30}
                />
                <YAxis hide />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Acumulado']}
                  labelStyle={{ color: '#64748b', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
