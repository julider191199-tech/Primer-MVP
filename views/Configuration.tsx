import React, { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react';

export const Configuration: React.FC = () => {
  const { budgetConfig, updateBudgetConfig, laborTypes, setLaborTypes, materialTypes, setMaterialTypes } = useBudget();
  
  // Budget State
  const [labor, setLabor] = useState(0);
  const [materials, setMaterials] = useState(0);
  const [haulage, setHaulage] = useState(0);
  const [rentals, setRentals] = useState(0);
  const [unforeseen, setUnforeseen] = useState(0);
  
  // Lists State
  const [newLaborType, setNewLaborType] = useState('');
  const [newMaterialType, setNewMaterialType] = useState('');

  const [showSaved, setShowSaved] = useState(false);

  // Sync state with context on mount
  useEffect(() => {
    setLabor(budgetConfig.labor);
    setMaterials(budgetConfig.materials);
    setHaulage(budgetConfig.haulage);
    setRentals(budgetConfig.rentals);
    setUnforeseen(budgetConfig.unforeseen);
  }, [budgetConfig]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateBudgetConfig({
      labor,
      materials,
      haulage,
      rentals,
      unforeseen,
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleAddLaborType = () => {
    if (newLaborType.trim()) {
      setLaborTypes([...laborTypes, newLaborType.trim()]);
      setNewLaborType('');
    }
  };

  const handleDeleteLaborType = (index: number) => {
    const newList = [...laborTypes];
    newList.splice(index, 1);
    setLaborTypes(newList);
  };

  const handleAddMaterialType = () => {
    if (newMaterialType.trim()) {
      setMaterialTypes([...materialTypes, newMaterialType.trim()]);
      setNewMaterialType('');
    }
  };

  const handleDeleteMaterialType = (index: number) => {
    const newList = [...materialTypes];
    newList.splice(index, 1);
    setMaterialTypes(newList);
  };

  const total = labor + materials + haulage + rentals + unforeseen;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Configuración General</h1>
        <p className="text-slate-500">Ajuste los topes presupuestales y listas desplegables</p>
      </header>

      {/* SECTION 1: BUDGET */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <h2 className="text-lg font-bold text-slate-800">1. Topes Presupuestales</h2>
        </div>

        <form onSubmit={handleSaveBudget} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Mano de Obra ($)</label>
                <input 
                    type="number" min="0" value={labor}
                    onChange={(e) => setLabor(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Materiales ($)</label>
                <input 
                    type="number" min="0" value={materials}
                    onChange={(e) => setMaterials(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Acarreos ($)</label>
                <input 
                    type="number" min="0" value={haulage}
                    onChange={(e) => setHaulage(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Alquileres ($)</label>
                <input 
                    type="number" min="0" value={rentals}
                    onChange={(e) => setRentals(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Imprevistos ($)</label>
                <input 
                    type="number" min="0" value={unforeseen}
                    onChange={(e) => setUnforeseen(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
             <div>
                <span className="text-sm text-slate-500 block">Nuevo Presupuesto Total</span>
                <span className="text-2xl font-bold text-slate-900">${total.toLocaleString()}</span>
             </div>
             <button 
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
                <Save size={18} />
                Actualizar Presupuesto
            </button>
          </div>
          {showSaved && (
             <p className="text-emerald-600 text-center text-sm font-medium animate-fade-in">
                Presupuesto guardado exitosamente
             </p>
          )}
        </form>
      </section>

      {/* SECTION 2: SUBCATEGORY LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LABOR TYPES */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
             <h2 className="text-lg font-bold text-slate-800">2. Tipos de Mano de Obra</h2>
          </div>
          
          <div className="flex gap-2 mb-4">
             <input 
                type="text" 
                placeholder="Nuevo rol (ej. Pintor)"
                value={newLaborType}
                onChange={(e) => setNewLaborType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLaborType()}
                className="flex-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
             />
             <button 
                onClick={handleAddLaborType}
                disabled={!newLaborType.trim()}
                className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 disabled:opacity-50"
             >
               <Plus size={20} />
             </button>
          </div>

          <ul className="flex-1 space-y-2 overflow-y-auto max-h-60 pr-2">
            {laborTypes.map((item, idx) => (
               <li key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 text-sm">
                  <span className="text-slate-700">{item}</span>
                  <button 
                    onClick={() => handleDeleteLaborType(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
               </li>
            ))}
            {laborTypes.length === 0 && <li className="text-sm text-slate-400 italic">Sin elementos definidos</li>}
          </ul>
        </section>

        {/* MATERIAL TYPES */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
             <h2 className="text-lg font-bold text-slate-800">3. Tipos de Materiales</h2>
          </div>
          
          <div className="flex gap-2 mb-4">
             <input 
                type="text" 
                placeholder="Nuevo material (ej. Pintura)"
                value={newMaterialType}
                onChange={(e) => setNewMaterialType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMaterialType()}
                className="flex-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
             />
             <button 
                onClick={handleAddMaterialType}
                disabled={!newMaterialType.trim()}
                className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 disabled:opacity-50"
             >
               <Plus size={20} />
             </button>
          </div>

          <ul className="flex-1 space-y-2 overflow-y-auto max-h-60 pr-2">
            {materialTypes.map((item, idx) => (
               <li key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 text-sm">
                  <span className="text-slate-700">{item}</span>
                  <button 
                    onClick={() => handleDeleteMaterialType(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
               </li>
            ))}
            {materialTypes.length === 0 && <li className="text-sm text-slate-400 italic">Sin elementos definidos</li>}
          </ul>
        </section>

      </div>
    </div>
  );
};
