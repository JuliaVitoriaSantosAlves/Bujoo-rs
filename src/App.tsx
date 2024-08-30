import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import AddExpense from './pages/AddExpense/AddExpense';
import Goals from './pages/Goals/Goals';
import Sidebar from './components/Sidebar/Sidebar';
import AddIncome from './pages/AddIncome/AddIncome';
import OverviewPage from './pages/OverviewPage/OverviewPage';
import DebtControl from './pages/DebtControl/DebtControl';
import AnnualSummary from './pages/AnnualSummary/AnnualSummary';
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/incomes" element={<AddIncome />} />
            <Route path="/overView" element={<OverviewPage />} />
            <Route path="/debtControl" element={<DebtControl />} />
            <Route path="/annualSummary" element={<AnnualSummary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;