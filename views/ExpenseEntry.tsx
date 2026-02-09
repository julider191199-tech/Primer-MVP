import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Category } from '../types';
import { Save, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

export const ExpenseEntry: React.FC = () => {
  const { addExpense, laborTypes, materialTypes } = useBudget();
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category | ''>('');
  const [subcategory, setSubcategory] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState('');
  const [unforeseenDetail, setUnforeseenDetail] = useState('');
  
  // Error State
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setSubcategory(''); // Reset subcategory when main category changes
    setUnforeseenDetail('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!category) {
      setError('Seleccione una categoría');
      return;
    }
    const valAmount = parseFloat(amount);
    if (isNaN(valAmount) || valAmount <= 0) {
      setError('El valor debe ser mayor a cero');
      return;
    }

    // Specific Validations
    if (category === Category.IMPREVISTOS && !unforeseenDetail.trim()) {
      setError('Debe detallar el imprevisto');
      return;
    }

    if (category === Category.MANO_DE_OBRA && !subcategory) {
      setError('Seleccione el tipo de mano de obra');
      return;
    }

    if (category === Category.MATERIALES && !subcategory) {
      setError('Seleccione el tipo de material');
      return;
    }

    // Add Expense
    addExpense({
      date,
      category,
      subcategory: (category === Category.MANO_DE_OBRA || category === Category.MATERIALES) ? subcategory : undefined,
      amount: valAmount,
      note,
      unforeseenDetail: category === Category.IMPREVISTOS ? unforeseenDetail : undefined,
    });

    // Reset Form & Show Success
    setAmount('');
    setNote('');
    setUnforeseenDetail('');
    setSubcategory('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Registrar Gasto</h1>
        <p className="text-slate-500">Ingrese los detalles del nuevo gasto</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
        
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle size={18} />
            Gasto registrado correctamente
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Fecha</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Categoría</label>
            <div className="relative">
              <select
                required
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as Category)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
              >
                <option value="" disabled>Seleccione...</option>
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Dynamic Subcategory: Mano de Obra */}
        {category === Category.MANO_DE_OBRA && (
          <div className="space-y-2 animate-fade-in">
             <label className="text-sm font-medium text-slate-700">Tipo de Mano de Obra</label>
             <div className="relative">
              <select 
                required
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
              >
                <option value="" disabled>Seleccione el rol...</option>
                {laborTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
             </div>
          </div>
        )}

        {/* Dynamic Subcategory: Materiales */}
        {category === Category.MATERIALES && (
          <div className="space-y-2 animate-fade-in">
             <label className="text-sm font-medium text-slate-700">Tipo de Material</label>
             <div className="relative">
              <select 
                required
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
              >
                <option value="" disabled>Seleccione material...</option>
                {materialTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
             </div>
          </div>
        )}

        {/* Dynamic Field for Unforeseen */}
        {category === Category.IMPREVISTOS && (
          <div className="space-y-2 animate-fade-in">
             <label className="text-sm font-medium text-amber-700 flex items-center gap-2">
                <AlertCircle size={16} />
                Detalle del Imprevisto (Obligatorio)
             </label>
             <input 
              type="text" 
              placeholder="¿Qué ocurrió?"
              required
              value={unforeseenDetail}
              onChange={(e) => setUnforeseenDetail(e.target.value)}
              className="w-full p-2.5 border border-amber-300 bg-amber-50 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Valor ($)</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="0.00"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Observación (Opcional)</label>
          <textarea 
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          ></textarea>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Guardar Gasto
          </button>
        </div>

      </form>
    </div>
  );
};
