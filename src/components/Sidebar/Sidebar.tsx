import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Vamos criar um arquivo CSS para estilizar a sidebar

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>Rastreador financeiro</h2>
      <nav>
        <ul>
          <li>
            <Link to="/">Painel</Link>
          </li>
          <li>
            <Link to="/overView">Detalhes</Link>
          </li>
          <li>
            <Link to="/add-expense">Adicionar Despesa</Link>
          </li>
          <li>
            <Link to="/incomes">Adicionar Entrada</Link>
          </li>
          <li>
            <Link to="/goals">Metas</Link>
          </li>
          <li>
            <Link to="/debtControl">Dividas</Link>
          </li>
          <li>
            <Link to="/annualSummary">Balanço anual</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;