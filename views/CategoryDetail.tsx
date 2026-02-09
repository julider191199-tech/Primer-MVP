import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { Category } from '../types';

export const CategoryDetail: React.FC = () => {
  const { budgetConfig, getExecutedByCategory } = useBudget();

  const categories = [
    { key: Category.MANO_DE_OBRA, label: Category.MANO_DE_OBRA, budget: budgetConfig.labor },
    { key: Category.MATERIALES, label: Category.MATERIALES, budget: budgetConfig.materials },
    { key: Category.ACARREOS, label: Category.ACARREOS, budget: budgetConfig.haulage },
    { key: Category.ALQUILERES, label: Category.ALQUILERES, budget: budgetConfig.rentals },
    { key: Category.IMPREVISTOS, label: Category.IMPREVISTOS, budget: budgetConfig.unforeseen },
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage > 100) return 'text-red-600 bg-red-50 ring-red-600/20';
    if (percentage >= 70) return 'text-amber-600 bg-amber-50 ring-amber-600/20';
    return 'text-emerald-600 bg-emerald-50 ring-emerald-600/20';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Detalle por Categoría</h1>
        <p className="text-slate-500">Análisis presupuestal desglosado</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Categoría</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Presupuesto</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Ejecutado</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Saldo</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">% Ejecutado</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => {
                const executed = getExecutedByCategory(cat.key);
                const balance = cat.budget - executed;
                const percentage = cat.budget > 0 ? (executed / cat.budget) * 100 : 0;
                
                return (
                  <tr key={cat.key} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{cat.label}</td>
                    <td className="px-6 py-4 text-slate-600 text-right font-mono">${cat.budget.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600 text-right font-mono">${executed.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-right font-mono font-medium ${balance < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                      ${balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium w-8 text-right">{percentage.toFixed(0)}%</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgressBarColor(percentage)}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(percentage)}`}>
                          {percentage > 100 ? 'Excedido' : percentage >= 70 ? 'Alerta' : 'Ok'}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
               <tr>
                 <td className="px-6 py-4 font-bold text-slate-800">TOTAL</td>
                 <td className="px-6 py-4 font-bold text-slate-800 text-right">
                    ${categories.reduce((a, b) => a + b.budget, 0).toLocaleString()}
                 </td>
                 <td className="px-6 py-4 font-bold text-slate-800 text-right">
                    ${categories.reduce((a, b) => a + getExecutedByCategory(b.key), 0).toLocaleString()}
                 </td>
                 <td className="px-6 py-4 font-bold text-slate-800 text-right">
                    ${categories.reduce((a, b) => a + (b.budget - getExecutedByCategory(b.key)), 0).toLocaleString()}
                 </td>
                 <td colSpan={2}></td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
