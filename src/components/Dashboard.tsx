import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { Transaction, Budget, SubscriptionTier, SpendingInsight } from '../types';
import { SpendingChart } from './SpendingChart';
import { RecentTransactions } from './RecentTransactions';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  userTier: SubscriptionTier;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, budgets, userTier }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netWorth = totalIncome - totalExpenses;

  const spendingByCategory: SpendingInsight[] = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({
          category: t.category,
          amount: t.amount,
          percentage: 0,
          trend: 'stable'
        });
      }
      return acc;
    }, [] as SpendingInsight[])
    .map(item => ({
      ...item,
      percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const budgetAlerts = budgets.filter(budget => 
    (budget.spent / budget.amount) > 0.8
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-blue-100 text-lg">
              Here's your financial overview for this month
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm mb-1">Current Plan</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              userTier === 'premium' 
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {userTier === 'premium' ? '👑 Premium' : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-green-600">
              ₹{totalIncome.toLocaleString()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800">Total Income</h3>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-red-600">
              ₹{totalExpenses.toLocaleString()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800">Total Expenses</h3>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${netWorth >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <DollarSign className={netWorth >= 0 ? 'text-blue-600' : 'text-orange-600'} size={24} />
            </div>
            <span className={`text-2xl font-bold ${netWorth >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ₹{netWorth.toLocaleString()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800">Net Balance</h3>
          <p className="text-sm text-gray-500 mt-1">Income - Expenses</p>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="text-orange-600" size={24} />
            <h3 className="text-lg font-semibold text-orange-800">Budget Alerts</h3>
          </div>
          <div className="space-y-3">
            {budgetAlerts.map(budget => (
              <div key={budget.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                <div>
                  <p className="font-medium text-gray-800">{budget.category}</p>
                  <p className="text-sm text-gray-500">
                    ₹{budget.spent.toLocaleString()} of ₹{budget.amount.toLocaleString()} spent
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">
                    {Math.round((budget.spent / budget.amount) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500">over budget</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SpendingChart data={spendingByCategory} />
        <RecentTransactions transactions={transactions.slice(0, 5)} />
      </div>
    </div>
  );
};