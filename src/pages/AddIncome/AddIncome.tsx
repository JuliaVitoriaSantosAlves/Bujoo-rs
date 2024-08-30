import React, { useState, useEffect } from 'react';

const AddIncome: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [source, setSource] = useState<string>(''); // 'source' para a origem da receita
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Função para adicionar uma nova receita
  const addIncome = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples
    if (amount <= 0 || !source || !date) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // Nova receita
    const newIncome = {
      id: Date.now(), // Gerar um ID único
      amount,
      source,
      date,
    };

    try {
      await fetch('http://localhost:5000/incomes', { // Endpoint para adicionar receitas
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIncome),
      });
      alert('Receita adicionada com sucesso!');
      setAmount(0);
      setSource('');
      setDate(getCurrentDate()); // Reseta para a data atual
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      setError('Erro ao adicionar receita. Tente novamente.');
    }
  };

  // Função para obter a data atual no formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setDate(getCurrentDate()); // Define a data inicial para a data atual
  }, []);

  return (
    <div className="addExpense-container">
      <h1>Adicionar Receita</h1>
      <form onSubmit={addIncome}>
        <div className='addExpense-form'>
          <div>
            <label htmlFor="amount">Valor (R$):</label>
            <input
              type="number"
              id="amount"
              placeholder="valor..."
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="source">Origem:</label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            >
              <option value="">Selecione a origem</option>
              <option value="Salário">Salário</option>
              <option value="Freelance">Freelance</option>
              <option value="Investimentos">Investimentos</option>
              <option value="Presente">Presente</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label htmlFor="date">Data:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Adicionar Receita</button>
        </div>
      </form>
    </div>
  );
};

export default AddIncome;