import React, { useEffect, useState } from 'react';
import ExpensesChart from '../../components/ExpensesChart';
import { Expense } from '../../interfaces/Expense.types';
import { Income } from '../../interfaces/Income.types';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filterByMonth = (date: string) => date.startsWith(selectedMonth);

  const expensesByDate = expenses
    .filter(expense => filterByMonth(expense.date))
    .reduce((acc: Record<string, number>, expense) => {
      const date = expense.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += expense.amount;
      return acc;
    }, {});

  const incomesByDate = incomes
    .filter(income => filterByMonth(income.date))
    .reduce((acc: Record<string, number>, income) => {
      const date = income.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += income.amount;
      return acc;
    }, {});

  const totalExpenses = Object.values(expensesByDate).reduce((acc, amount) => acc + amount, 0);
  const totalIncomes = Object.values(incomesByDate).reduce((acc, amount) => acc + amount, 0);

  const balance = totalIncomes - totalExpenses;

  return (
    <div className="dashboard-container">
      {isLoading ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <div className='month-selector'>
            <label htmlFor="month">Selecionar Mês: </label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            />
          </div>
          <div className='subtitulos'>
            <h2>Total de Despesas: R$ {totalExpenses.toFixed(2)}</h2>
            <h2>Total de Receitas: R$ {totalIncomes.toFixed(2)}</h2>
            <h2 style={{ color: balance < 0 ? 'red' : 'inherit' }}>
              Balanço: R$ {balance.toFixed(2)}
            </h2>
          </div>
          <div className='grafico'>
            <ExpensesChart expensesByDate={expensesByDate} incomesByDate={incomesByDate} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;