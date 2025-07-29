import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ChatBot } from './components/ChatBot';
import { TransactionUpload } from './components/TransactionUpload';
import { BudgetPlanner } from './components/BudgetPlanner';
import { SubscriptionTier, Transaction, Budget } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userTier, setUserTier] = useState<SubscriptionTier>('free');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} budgets={budgets} userTier={userTier} />;
      case 'chat':
        return <ChatBot userTier={userTier} />;
      case 'upload':
        return <TransactionUpload 
          transactions={transactions} 
          setTransactions={setTransactions}
          userTier={userTier}
        />;
      case 'budget':
        return <BudgetPlanner 
          budgets={budgets}
          setBudgets={setBudgets}
          transactions={transactions}
        />;
      default:
        return <Dashboard transactions={transactions} budgets={budgets} userTier={userTier} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userTier={userTier}
        setUserTier={setUserTier}
      />
      <main className="container mx-auto px-4 py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;