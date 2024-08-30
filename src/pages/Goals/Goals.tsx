import React, { useState, useEffect } from 'react';

interface Goal {
  id: string;
  target: number;
  current: number;
  isCompleted: boolean;
  description: string;
  duration: string; // Novo campo para a duração da meta
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalValue, setNewGoalValue] = useState<number>(0);
  const [newGoalDescription, setNewGoalDescription] = useState<string>('');
  const [newGoalDuration, setNewGoalDuration] = useState<string>('short'); // Padrão: Curto Prazo
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [amountToAdd, setAmountToAdd] = useState<number>(0);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:5000/goals');
      const data = await response.json();

      if (Array.isArray(data)) {
        setGoals(data);
      } else {
        console.error('Dados retornados não são um array:', data);
        setGoals([]);
      }
    } catch (error) {
      console.error('Erro ao buscar as metas:', error);
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = async (goal: Goal, amount: number) => {
    try {
      const updatedCurrent = goal.current + amount;
      const updatedGoal = {
        ...goal,
        current: updatedCurrent,
        isCompleted: updatedCurrent >= goal.target,
      };
      await fetch(`http://localhost:5000/goals/${goal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoal),
      });
      fetchGoals();
    } catch (error) {
      console.error('Erro ao atualizar a meta:', error);
    }
  };

  const addGoal = async () => {
    if (newGoalValue <= 0 || !newGoalDescription) return;

    try {
      await fetch('http://localhost:5000/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: newGoalValue,
          current: 0,
          isCompleted: false,
          description: newGoalDescription,
          duration: newGoalDuration, // Enviar a duração da meta
        }),
      });
      setNewGoalValue(0);
      setNewGoalDescription('');
      setNewGoalDuration('short');
      fetchGoals();
    } catch (error) {
      console.error('Erro ao adicionar a meta:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleGoalValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGoalValue(Number(e.target.value));
  };

  const handleGoalDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGoalDescription(e.target.value);
  };

  const handleGoalDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewGoalDuration(e.target.value);
  };

  const handleAmountToAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToAdd(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal();
  };

  const handleAddAmount = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && amountToAdd > 0) {
      updateGoal(goal, amountToAdd);
      setAmountToAdd(0);
    }
  };

  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);

  return (
    <div className="Goals-content">
      <h1>Painel de Metas</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className='Goals-form'>
              <div>
                <label htmlFor="newGoalValue">Adicionar Nova Meta (R$):</label>
                <input
                  type="number"
                  id="newGoalValue"
                  value={newGoalValue}
                  onChange={handleGoalValueChange}
                />
              </div>
              <div>
                <label htmlFor="newGoalDescription">Descrição:</label>
                <input
                  type="text"
                  id="newGoalDescription"
                  value={newGoalDescription}
                  onChange={handleGoalDescriptionChange}
                />
              </div>
              <div>
                <label htmlFor="newGoalDuration">Duração:</label>
                <select
                  id="newGoalDuration"
                  value={newGoalDuration}
                  onChange={handleGoalDurationChange}
                >
                  <option value="short">Curto Prazo</option>
                  <option value="medium">Médio Prazo</option>
                  <option value="long">Longo Prazo</option>
                </select>
              </div>
              <button type="submit" className='button-goals'>Adicionar Meta</button>
            </div>
          </form>

          <div className="goals-list">
            {activeGoals.length > 0 && <h2>Metas Atuais</h2>}
            {activeGoals.map(goal => (
              <div
                key={goal.id}
                className={`goal-item ${goal.current >= goal.target ? 'completed' : ''}`}
              >
                <p>Meta: R$ {(goal.target || 0).toFixed(2)}</p>
                <p>Atual: R$ {(goal.current || 0).toFixed(2)}</p>
                <p>Descrição: {goal.description}</p>
                <p>Duração: {goal.duration === 'short' ? 'Curto Prazo' : goal.duration === 'medium' ? 'Médio Prazo' : 'Longo Prazo'}</p>
                <p>Falta: R$ {(goal.target - goal.current || 0).toFixed(2)}</p>
                <input
                  type="number"
                  placeholder="Adicionar valor"
                  value={amountToAdd}
                  onChange={handleAmountToAddChange}
                />
                <button onClick={() => handleAddAmount(goal.id)} className='button-goals'>Adicionar Valor</button>
              </div>
            ))}

            {completedGoals.length > 0 && <h2>Metas Concluídas</h2>}
            {completedGoals.map(goal => (
              <div key={goal.id} className="goal-item completed">
                <p>Meta: R$ {(goal.target || 0).toFixed(2)}</p>
                <p>Atual: R$ {(goal.current || 0).toFixed(2)}</p>
                <p>Descrição: {goal.description}</p>
                <p>Duração: {goal.duration === 'short' ? 'Curto Prazo' : goal.duration === 'medium' ? 'Médio Prazo' : 'Longo Prazo'}</p>
                <p>Meta Concluída! Parabéns!</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Goals;