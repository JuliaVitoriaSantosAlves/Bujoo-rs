import React, { useEffect, useState } from 'react';
import BarChart from '../../components/BarChart/BarChart';

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
}

interface Income {
  id: number;
  amount: number;
  source: string;
  date: string;
}

type Transaction = Expense | Income;

const OverviewPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesResponse = await fetch('http://localhost:5000/expenses');
        const expensesData = await expensesResponse.json();
        setExpenses(expensesData);

        const incomesResponse = await fetch('http://localhost:5000/incomes');
        const incomesData = await incomesResponse.json();
        setIncomes(incomesData);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchData();
  }, []);

  const getAllCategories = <T extends Transaction>(items: T[], key: keyof T) => {
    const counts = items.reduce((acc: Record<string, number>, item) => {
      const category = String(item[key]);
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.amount;
      return acc;
    }, {});

    // Ordena as categorias por valor para melhor visualização
    const sortedCategories = Object.entries(counts).sort(([, a], [, b]) => b - a);

    return sortedCategories;
  };

  const allExpenseCategories = getAllCategories(expenses, 'category');
  const allIncomeSources = getAllCategories(incomes, 'source');

  const maxExpenseValue = Math.max(...allExpenseCategories.map(([, value]) => value));
  const maxIncomeValue = Math.max(...allIncomeSources.map(([, value]) => value));

  return (
    <div className="overview-container">
      <h1>Fontes de Despesas e Receitas</h1>
      <div className="overview-section">
        <h2>Categorias de Despesas</h2>
        {allExpenseCategories.map(([category, amount]) => (
          <BarChart
            key={category}
            label={category}
            value={amount}
            maxValue={maxExpenseValue}
            color="rgba(255, 99, 132, 1)"
          />
        ))}
      </div>
      <div className="overview-section">
        <h2>Fontes de Receitas</h2>
        {allIncomeSources.map(([source, amount]) => (
          <BarChart
            key={source}
            label={source}
            value={amount}
            maxValue={maxIncomeValue}
            color="rgba(54, 162, 235, 1)"
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;