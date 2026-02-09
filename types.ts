export enum Category {
  MANO_DE_OBRA = 'Mano de obra',
  MATERIALES = 'Materiales',
  ACARREOS = 'Acarreos',
  ALQUILERES = 'Alquileres',
  IMPREVISTOS = 'Imprevistos',
}

export interface Expense {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  category: Category;
  subcategory?: string; 
  amount: number;
  note?: string;
  unforeseenDetail?: string; 
}

// Representación de la fila en la tabla 'gastos' de Supabase
export interface DBExpense {
  id: number;
  created_at: string;
  descripcion: string; // Usaremos esto para guardar note + subcategory
  monto: number;
  fecha: string;
  categorias: string; // Nombre de la categoría
}

export interface BudgetConfig {
  labor: number;
  materials: number;
  haulage: number; 
  rentals: number; 
  unforeseen: number;
}

export interface BudgetContextType {
  budgetConfig: BudgetConfig;
  expenses: Expense[];
  laborTypes: string[];
  materialTypes: string[];
  isLoading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateBudgetConfig: (config: BudgetConfig) => Promise<void>;
  setLaborTypes: (types: string[]) => void;
  setMaterialTypes: (types: string[]) => void;
  getTotalBudget: () => number;
  getExecutedAmount: () => number;
  getExecutedByCategory: (category: Category) => number;
}
