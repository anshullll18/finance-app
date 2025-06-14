// App.js
import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Target, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';
import './App.css';

const PersonalFinanceTracker = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 45.50, category: 'Food', description: 'Grocery shopping', date: '2024-06-10' },
    { id: 2, type: 'income', amount: 3200.00, category: 'Salary', description: 'Monthly salary', date: '2024-06-01' },
    { id: 3, type: 'expense', amount: 120.00, category: 'Transport', description: 'Gas and maintenance', date: '2024-06-08' },
    { id: 4, type: 'expense', amount: 80.00, category: 'Entertainment', description: 'Movie and dinner', date: '2024-06-05' },
    { id: 5, type: 'income', amount: 500.00, category: 'Freelance', description: 'Web design project', date: '2024-06-03' },
  ]);

  const [budgets, setBudgets] = useState([
    { category: 'Food', limit: 300, spent: 45.50 },
    { category: 'Transport', limit: 200, spent: 120.00 },
    { category: 'Entertainment', limit: 150, spent: 80.00 },
    { category: 'Shopping', limit: 100, spent: 0 },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterType, setFilterType] = useState('all');

  const categories = {
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other']
  };

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) return;
    
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };
    
    setTransactions([transaction, ...transactions]);
    
    if (transaction.type === 'expense') {
      setBudgets(budgets.map(budget => 
        budget.category === transaction.category 
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }
    
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const filteredTransactions = transactions.filter(t => 
    filterType === 'all' || t.type === filterType
  );

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.slice(0, 7);
    if (!acc[month]) acc[month] = { month, income: 0, expenses: 0 };
    acc[month][transaction.type === 'income' ? 'income' : 'expenses'] += transaction.amount;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <DollarSign size={32} className="logo-icon" />
            <h1>FinanceTracker</h1>
          </div>
          <nav className="nav">
            {['dashboard', 'transactions', 'budget', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`nav-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="summary-cards">
              <div className="card income-card">
                <TrendingUp size={32} />
                <div>
                  <p>Total Income</p>
                  <h2>${totalIncome.toFixed(2)}</h2>
                </div>
              </div>
              <div className="card expense-card">
                <TrendingDown size={32} />
                <div>
                  <p>Total Expenses</p>
                  <h2>${totalExpenses.toFixed(2)}</h2>
                </div>
              </div>
              <div className="card balance-card">
                <DollarSign size={32} />
                <div>
                  <p>Balance</p>
                  <h2 className={balance >= 0 ? 'positive' : 'negative'}>
                    ${balance.toFixed(2)}
                  </h2>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Quick Add Transaction</h3>
              <div className="transaction-form">
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value, category: ''})}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                />
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories[newTransaction.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
                <button onClick={addTransaction} className="add-button">
                  <PlusCircle size={16} />
                  Add
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Recent Transactions</h3>
              <div className="transactions-list">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className={`transaction-icon ${transaction.type}`}>
                        {transaction.type === 'income' ? 
                          <TrendingUp size={16} /> : 
                          <TrendingDown size={16} />
                        }
                      </div>
                      <div>
                        <p className="transaction-description">{transaction.description}</p>
                        <p className="transaction-meta">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <span className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions">
            <div className="transactions-header">
              <h2>All Transactions</h2>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>
            
            <div className="card">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.category}</td>
                      <td>
                        <span className={`badge ${transaction.type}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="budget">
            <h2>Budget Overview</h2>
            <div className="budget-grid">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = budget.spent > budget.limit;
                
                return (
                  <div key={budget.category} className="card budget-card">
                    <div className="budget-header">
                      <h3>{budget.category}</h3>
                      <Target size={20} />
                    </div>
                    <div className="budget-details">
                      <div className="budget-amounts">
                        <span>Spent: ${budget.spent.toFixed(2)}</span>
                        <span>Limit: ${budget.limit.toFixed(2)}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress ${isOverBudget ? 'over-budget' : percentage > 80 ? 'warning' : 'good'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="budget-status">
                        {percentage.toFixed(1)}% of budget used
                        {isOverBudget && <span className="over-budget-text"> (Over budget!)</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics">
            <h2>Financial Analytics</h2>
            
            <div className="card">
              <h3>Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-grid">
              <div className="card">
                <h3>Expense Categories</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <PieChart
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </PieChart>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="no-data">No expense data available</p>
                )}
              </div>

              <div className="card">
                <h3>Category Spending</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pieData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PersonalFinanceTracker;