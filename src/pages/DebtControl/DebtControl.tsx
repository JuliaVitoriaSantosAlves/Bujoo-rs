import React, { useState, useEffect } from 'react';
import './DebtControl.css';

interface Debt {
  id: string;
  amount: number;
  interestRate: number;
  dueDate: string;
  installments: number;
  paidInstallments: number;
  isPaid: boolean;
}

const DebtControl: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [newDebtAmount, setNewDebtAmount] = useState<number>(0);
  const [newDebtInterestRate, setNewDebtInterestRate] = useState<number>(0);
  const [newDebtDueDate, setNewDebtDueDate] = useState<string>('');
  const [newDebtInstallments, setNewDebtInstallments] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDebts = async () => {
    try {
      const response = await fetch('http://localhost:5000/debts');
      const data = await response.json();
      if (Array.isArray(data)) {
        setDebts(data);
      } else {
        console.error('Dados retornados não são um array:', data);
        setDebts([]);
      }
    } catch (error) {
      console.error('Erro ao buscar as dívidas:', error);
      setDebts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addDebt = async () => {
    if (newDebtAmount <= 0 || newDebtInterestRate < 0 || !newDebtDueDate) return;
  
    try {
      await fetch('http://localhost:5000/debts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(), // Convertendo para string aqui
          amount: newDebtAmount,
          interestRate: newDebtInterestRate,
          dueDate: newDebtDueDate,
          installments: newDebtInstallments,
          paidInstallments: 0,
          isPaid: false,
        }),
      });
      setNewDebtAmount(0);
      setNewDebtInterestRate(0);
      setNewDebtDueDate('');
      setNewDebtInstallments(1);
      fetchDebts();
    } catch (error) {
      console.error('Erro ao adicionar a dívida:', error);
    }
  };

  const markInstallmentAsPaid = async (id: string) => {
    const debtToUpdate = debts.find(debt => debt.id === id.toString());
    if (!debtToUpdate) {
      console.error(`Dívida com ID ${id} não encontrada no estado do cliente.`);
      return;
    }
  
    debtToUpdate.paidInstallments += 1;
    debtToUpdate.isPaid = debtToUpdate.paidInstallments >= debtToUpdate.installments;
  
    try {
      const response = await fetch(`http://localhost:5000/debts/${id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(debtToUpdate),
      });
  
      if (response.status === 404) {
        throw new Error(`Dívida com ID ${id.toString()} não encontrada no servidor.`);
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na atualização: ${response.statusText} - ${errorText}`);
      }
  
      setDebts(prevDebts => 
        prevDebts.map(debt => (debt.id === id.toString() ? debtToUpdate : debt))
      );
    } catch (error) {
      console.error('Erro ao atualizar a dívida:', error);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleDebtAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDebtAmount(Number(e.target.value));
  };

  const handleDebtInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDebtInterestRate(Number(e.target.value));
  };

  const handleDebtDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDebtDueDate(e.target.value);
  };

  const handleDebtInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDebtInstallments(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDebt();
  };

  const calculateInstallmentAmount = (debt: Debt): number => {
    const totalAmount = debt.amount * (1 + debt.interestRate / 100);
    return totalAmount / debt.installments;
  };

  const totalDebt = debts.reduce((acc, debt) => acc + debt.amount, 0);
  const totalInstallments = debts.reduce((acc, debt) => acc + calculateInstallmentAmount(debt) * (debt.installments - debt.paidInstallments), 0);

  return (
    <div className="DebtControl-content">
      <h1>Controle de Dívidas</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className='DebtControl-form'>
              <div>
                <label htmlFor="newDebtAmount">Valor da Dívida (R$):</label>
                <input
                  type="number"
                  id="newDebtAmount"
                  value={newDebtAmount}
                  onChange={handleDebtAmountChange}
                />
              </div>
              <div>
                <label htmlFor="newDebtInterestRate">Taxa de Juros (%):</label>
                <input
                  type="number"
                  id="newDebtInterestRate"
                  value={newDebtInterestRate}
                  onChange={handleDebtInterestRateChange}
                />
              </div>
              <div>
                <label htmlFor="newDebtDueDate">Data de Vencimento:</label>
                <input
                  type="date"
                  id="newDebtDueDate"
                  value={newDebtDueDate}
                  onChange={handleDebtDueDateChange}
                />
              </div>
              <div>
                <label htmlFor="newDebtInstallments">Número de Parcelas:</label>
                <input
                  type="number"
                  id="newDebtInstallments"
                  value={newDebtInstallments}
                  onChange={handleDebtInstallmentsChange}
                  min="1"
                />
              </div>
              <button type="submit" className='button-debt'>Adicionar Dívida</button>
            </div>
          </form>

          <div className="debts-list">
            <h2>Lista de Dívidas</h2>
            {debts.map(debt => (
              <div key={debt.id} className="debt-item">
                <p>Valor: R$ {(debt.amount || 0).toFixed(2)}</p>
                <p>Juros: {debt.interestRate}%</p>
                <p>Data de Vencimento: {new Date(debt.dueDate).toLocaleDateString()}</p>
                <p>Parcelas: {debt.installments}</p>
                <p>Parcelas Pagas: {debt.paidInstallments}</p>
                <p>Valor da Parcela: R$ {calculateInstallmentAmount(debt).toFixed(2)}</p>
                <p>Valor Total Restante: R$ {(calculateInstallmentAmount(debt) * (debt.installments - debt.paidInstallments)).toFixed(2)}</p>
                {debt.isPaid ? (
                  <p>Dívida Quitada</p>
                ) : (
                  <button className="button-installment" onClick={() => markInstallmentAsPaid(debt.id)}>Paguei uma parcela</button>
                )}
              </div>
            ))}
          </div>

          <div className="payment-plan">
            <h2>Plano de Pagamento</h2>
            <p>Valor Total das Dívidas: R$ {totalDebt.toFixed(2)}</p>
            <p>Valor Total das Parcelas Restantes: R$ {totalInstallments.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default DebtControl;