import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Category } from '../types';
import { Filter, Calendar, Info, Tag } from 'lucide-react';

export const History: React.FC = () => {
  const { expenses } = useBudget();
  
  // Filters
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtering Logic
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesStart = startDate ? expense.date >= startDate : true;
    const matchesEnd = endDate ? expense.date <= endDate : true;
    return matchesCategory && matchesStart && matchesEnd;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Descending sort

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
        case Category.IMPREVISTOS: return 'bg-amber-100 text-amber-800';
        case Category.MANO_DE_OBRA: return 'bg-blue-100 text-blue-800';
        case Category.MATERIALES: return 'bg-green-100 text-green-800';
        case Category.ACARREOS: return 'bg-gray-100 text-gray-800';
        case Category.ALQUILERES: return 'bg-purple-100 text-purple-800';
        default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Historial de Gastos</h1>
        <p className="text-slate-500">Trazabilidad completa de movimientos</p>
      </header>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} /> Categoría
          </label>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Todas</option>
            {Object.values(Category).map((cat) => (
               <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full space-y-1">
           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> Desde
          </label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> Hasta
          </label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div className="w-full md:w-auto">
            <button 
                onClick={() => { setFilterCategory('all'); setStartDate(''); setEndDate(''); }}
                className="w-full md:w-auto px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
                Limpiar
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredExpenses.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <p>No se encontraron gastos con estos filtros.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Fecha</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Categoría / Tipo</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Valor</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Detalles</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{expense.date}</td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                           <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getCategoryColor(expense.category)}`}>
                              {expense.category}
                           </span>
                           {expense.subcategory && (
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                 <Tag size={10} /> {expense.subcategory}
                              </span>
                           )}
                        </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-800">
                        ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{expense.note || <span className="text-slate-400 italic">Sin observación</span>}</div>
                        {expense.unforeseenDetail && (
                            <div className="mt-1 flex items-start gap-1 text-amber-700 text-xs font-medium">
                                <Info size={12} className="mt-0.5" /> {expense.unforeseenDetail}
                            </div>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};
