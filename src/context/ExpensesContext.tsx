import React, { createContext, useReducer, useContext, ReactNode } from 'react';

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
}

interface ExpensesState {
  expenses: Expense[];
}

type Action =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'REMOVE_EXPENSE'; payload: number }; // id

const expensesReducer = (state: ExpensesState, action: Action): ExpensesState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'REMOVE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    default:
      return state;
  }
};

interface ExpensesProviderProps {
  children: ReactNode;
}

const ExpensesContext = createContext<{
  state: ExpensesState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const ExpensesProvider: React.FC<ExpensesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(expensesReducer, { expenses: [] });

  return (
    <ExpensesContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};