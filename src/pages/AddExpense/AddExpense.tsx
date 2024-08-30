import React, { useState, useEffect } from 'react';

const AddExpense: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Função para adicionar uma nova despesa
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples
    if (amount <= 0 || !category || !date) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // Nova despesa
    const newExpense = {
      id: Date.now(), // Gerar um ID único
      amount,
      category,
      date,
    };

    try {
      await fetch('http://localhost:5000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });
      alert('Despesa adicionada com sucesso!');
      setAmount(0);
      setCategory('');
      setDate(getCurrentDate()); // Reseta para a data atual
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      setError('Erro ao adicionar despesa. Tente novamente.');
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
      <h1>Adicionar Despesa</h1>
      <form onSubmit={addExpense}>
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
            <label htmlFor="category">Categoria:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Compras">Compras</option>
              <option value="Lazer">Lazer</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Outros">Outros</option>
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
          <button type="submit">Adicionar Despesa</button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;