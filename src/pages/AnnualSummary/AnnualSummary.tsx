import React, { useState, useEffect } from 'react';

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

interface MonthlySummary {
  month: string;
  finalBalance: number;
}

const AnnualSummary: React.FC = () => {
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const expensesResponse = await fetch('http://localhost:5000/expenses');
      if (!expensesResponse.ok) {
        throw new Error(`Erro ao buscar despesas: ${expensesResponse.statusText}`);
      }
      const expenses: Expense[] = await expensesResponse.json();

      const incomesResponse = await fetch('http://localhost:5000/incomes');
      if (!incomesResponse.ok) {
        throw new Error(`Erro ao buscar rendimentos: ${incomesResponse.statusText}`);
      }
      const incomes: Income[] = await incomesResponse.json();

      const calculateMonthlyBalance = (): MonthlySummary[] => {
        const monthMap: { [key: string]: { income: number, expense: number } } = {};

        const addEntryToMonthMap = (date: string, amount: number, type: 'income' | 'expense') => {
          const month = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!monthMap[month]) {
            monthMap[month] = { income: 0, expense: 0 };
          }
          monthMap[month][type] += amount;
        };

        expenses.forEach((expense) => addEntryToMonthMap(expense.date, expense.amount, 'expense'));
        incomes.forEach((income) => addEntryToMonthMap(income.date, income.amount, 'income'));

        return Object.keys(monthMap).map(month => ({
          month,
          finalBalance: monthMap[month].income - monthMap[month].expense,
        }));
      };

      setMonthlySummaries(calculateMonthlyBalance());
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
      setMonthlySummaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalAnnualBalance = monthlySummaries.reduce((acc, summary) => acc + summary.finalBalance, 0);

  return (
    <div className="AnnualSummary-content">
      <h1>Resumo Anual</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table className="annual-summary-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Saldo Final (R$)</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummaries.map((summary, index) => (
                <tr key={index}>
                  <td>{summary.month}</td>
                  <td>{summary.finalBalance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="annual-balance">
            <h2>Saldo Final Anual: R$ {totalAnnualBalance.toFixed(2)}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default AnnualSummary;