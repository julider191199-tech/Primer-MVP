import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetConfig, BudgetContextType, Category, Expense, DBExpense } from '../types';
import { supabase } from '../lib/supabase';

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const INITIAL_BUDGET: BudgetConfig = {
  labor: 0,
  materials: 0,
  haulage: 0,
  rentals: 0,
  unforeseen: 0,
};

const INITIAL_LABOR_TYPES = ['Maestro de obra', 'Oficial', 'Ayudante', 'Electricista', 'Plomero'];
const INITIAL_MATERIAL_TYPES = ['Cemento', 'Tubería', 'Acero', 'Materiales eléctricos', 'Otros'];

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(INITIAL_BUDGET);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Listas locales (Podrían moverse a una tabla 'configuracion' en el futuro)
  const [laborTypes, setLaborTypes] = useState<string[]>(INITIAL_LABOR_TYPES);
  const [materialTypes, setMaterialTypes] = useState<string[]>(INITIAL_MATERIAL_TYPES);

  // 1. Cargar Datos al Iniciar
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!supabase) {
          console.warn('Supabase no configurado: omitiendo carga de datos inicial.');
          return;
        }
        await Promise.all([fetchBudgetConfig(), fetchExpenses()]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Funciones de Lectura (Supabase) ---

  const fetchBudgetConfig = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('categorias').select('*');
    if (error) {
      console.error('Error fetchBudgetConfig:', error);
      throw error;
    }

    if (data) {
      const newConfig: BudgetConfig = { ...INITIAL_BUDGET };
      data.forEach((row: any) => {
        if (row.nombre === Category.MANO_DE_OBRA) newConfig.labor = row.presupuesto;
        if (row.nombre === Category.MATERIALES) newConfig.materials = row.presupuesto;
        if (row.nombre === Category.ACARREOS) newConfig.haulage = row.presupuesto;
        if (row.nombre === Category.ALQUILERES) newConfig.rentals = row.presupuesto;
        if (row.nombre === Category.IMPREVISTOS) newConfig.unforeseen = row.presupuesto;
      });
      setBudgetConfig(newConfig);
    }
  };

  const fetchExpenses = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .order('fecha', { ascending: false });
    
    if (error) {
      console.error('Error fetchExpenses:', error);
      throw error;
    }

    if (data) {
      const formattedExpenses: Expense[] = data.map((row: DBExpense) => {
        // Intentamos parsear la descripción para sacar subcategoría/nota si la guardamos como JSON
        // O simplemente usamos el string
        let note = row.descripcion;
        let subcategory = undefined;
        let unforeseenDetail = undefined;

        // Lógica simple: Si la descripción contiene " | ", separamos subcategoría
        if (note && note.includes(' | ')) {
            const parts = note.split(' | ');
            if (parts.length > 1) {
                // Asumimos formato: "Subcategoria | Nota real"
                subcategory = parts[0]; 
                note = parts[1];
            }
        }
        
        // Para imprevistos, el detalle es importante
        if (row.categorias === Category.IMPREVISTOS) {
            unforeseenDetail = note; 
        }

        return {
          id: row.id.toString(),
          date: row.fecha,
          category: row.categorias as Category,
          amount: row.monto,
          subcategory,
          note,
          unforeseenDetail
        };
      });
      setExpenses(formattedExpenses);
    }
  };

  // --- Funciones de Escritura (Supabase) ---

  const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
    if (!supabase) {
      alert("Error: Supabase no está configurado. Verifique las variables de entorno.");
      return;
    }

    // Preparar descripción combinada para ajustarse a tu tabla 'gastos' que solo tiene 'descripcion'
    let descripcionFinal = newExpense.note || '';
    
    if (newExpense.subcategory) {
        descripcionFinal = `${newExpense.subcategory} | ${descripcionFinal}`;
    }
    if (newExpense.unforeseenDetail) {
        descripcionFinal = newExpense.unforeseenDetail;
    }

    const dbPayload = {
        fecha: newExpense.date,
        monto: newExpense.amount,
        categorias: newExpense.category,
        descripcion: descripcionFinal.trim()
    };

    console.log('Intentando guardar gasto:', dbPayload); // Debug

    const { data, error } = await supabase
        .from('gastos')
        .insert([dbPayload])
        .select();

    if (error) {
        console.error("Error guardando gasto:", error);
        alert(`Error al guardar en Supabase: ${error.message}`);
        return;
    }

    // Actualizar estado local para que la UI responda rápido
    if (data) {
        console.log('Gasto guardado exitosamente:', data); // Debug
        // Recargamos todo para asegurar consistencia
        await fetchExpenses(); 
    }
  };

  const updateBudgetConfig = async (config: BudgetConfig) => {
    if (!supabase) {
      alert("Error: Supabase no está configurado. Verifique las variables de entorno.");
      return;
    }

    // Mapeo de config a filas de la tabla 'categorias'
    const updates = [
        { nombre: Category.MANO_DE_OBRA, presupuesto: config.labor },
        { nombre: Category.MATERIALES, presupuesto: config.materials },
        { nombre: Category.ACARREOS, presupuesto: config.haulage },
        { nombre: Category.ALQUILERES, presupuesto: config.rentals },
        { nombre: Category.IMPREVISTOS, presupuesto: config.unforeseen },
    ];

    console.log('Intentando actualizar presupuesto:', updates); // Debug

    // Upsert (Insertar o Actualizar) en Supabase
    // Requiere que la columna 'nombre' sea UNIQUE en tu tabla 'categorias'
    const { error } = await supabase
        .from('categorias')
        .upsert(updates, { onConflict: 'nombre' });

    if (error) {
        console.error("Error actualizando presupuesto:", error);
        alert(`Error al actualizar configuración: ${error.message}`);
        return;
    }

    console.log('Presupuesto actualizado exitosamente'); // Debug
    setBudgetConfig(config);
  };

  // --- Cálculos (Igual que antes, pero usando datos reales) ---

  const getTotalBudget = () => {
    return (
      budgetConfig.labor + 
      budgetConfig.materials + 
      budgetConfig.haulage + 
      budgetConfig.rentals + 
      budgetConfig.unforeseen
    );
  };

  const getExecutedAmount = () => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  };

  const getExecutedByCategory = (category: Category) => {
    return expenses
      .filter((e) => e.category === category)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <BudgetContext.Provider
      value={{
        budgetConfig,
        expenses,
        laborTypes,
        materialTypes,
        isLoading,
        addExpense,
        updateBudgetConfig,
        setLaborTypes,
        setMaterialTypes,
        getTotalBudget,
        getExecutedAmount,
        getExecutedByCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
