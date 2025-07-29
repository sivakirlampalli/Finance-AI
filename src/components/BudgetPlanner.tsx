import React, { useState } from 'react';
import { PlusCircle, Target, TrendingUp, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Budget, Transaction } from '../types';

interface BudgetPlannerProps {
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
  transactions: Transaction[];
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  budgets,
  setBudgets,
  transactions
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly'
  });

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
  ];

  const calculateSpent = (budget: Budget): number => {
    const now = new Date();
    const periodStart = budget.period === 'weekly' 
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.category &&
        new Date(t.date) >= periodStart
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) return;

    const newBudget: Budget = {
      id: editingBudget?.id || Date.now().toString(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      spent: 0,
      period: formData.period,
      createdAt: editingBudget?.createdAt || new Date().toISOString()
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? newBudget : b));
      setEditingBudget(null);
    } else {
      setBudgets([...budgets, newBudget]);
    }

    setFormData({ category: '', amount: '', period: 'monthly' });
    setShowAddForm(false);
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setEditingBudget(budget);
    setShowAddForm(true);
  };

  const handleDelete = (budgetId: string) => {
    setBudgets(budgets.filter(b => b.id !== budgetId));
  };

  const generateAISuggestion = (category: string): string => {
    const suggestions = {
      'Food & Dining': 'Consider meal prepping to reduce dining out costs. Aim for 10-15% of your income.',
      'Transportation': 'Use public transport or carpool when possible. Budget around 15-20% of income.',
      'Shopping': 'Create a shopping list and stick to it. Limit impulse purchases to 5% of income.',
      'Entertainment': 'Look for free activities and use streaming services efficiently. Keep under 5% of income.',
      'Bills & Utilities': 'Review subscriptions monthly and negotiate better rates. Usually 25-30% of income.',
      'Healthcare': 'Build an HSA if available and shop for insurance. Budget 5-10% of income.',
      'Education': 'Invest in skills that increase earning potential. Allocate 3-5% of income.',
      'Travel': 'Book in advance and use travel rewards. Keep vacation spending under 5% of income.',
      'Other': 'Track miscellaneous expenses carefully and set a strict limit of 5% of income.'
    };
    
    return suggestions[category as keyof typeof suggestions] || 'Set realistic limits and track expenses regularly.';
  };

  const updatedBudgets = budgets.map(budget => ({
    ...budget,
    spent: calculateSpent(budget)
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Budget Planner</h2>
            <p className="text-gray-600">
              Create and manage your budgets with AI-powered recommendations.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <PlusCircle size={18} />
            <span>Add Budget</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Budget Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingBudget ? 'Edit Budget' : 'Create New Budget'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount (₹)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as 'weekly' | 'monthly' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBudget(null);
                  setFormData({ category: '', amount: '', period: 'monthly' });
                }}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {formData.category && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="text-blue-600 mt-1" size={18} />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">AI Recommendation</h4>
                  <p className="text-sm text-blue-700">
                    {generateAISuggestion(formData.category)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Budget Cards */}
      {updatedBudgets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Budgets Created</h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first budget to track spending and get AI insights.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <PlusCircle size={18} />
            <span>Create First Budget</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updatedBudgets.map((budget) => {
            const spentPercentage = (budget.spent / budget.amount) * 100;
            const isOverBudget = spentPercentage > 100;
            const isNearLimit = spentPercentage > 80;

            return (
              <div key={budget.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      ₹{budget.spent.toLocaleString()} / ₹{budget.amount.toLocaleString()}
                    </span>
                    <span className={`text-sm font-medium ${
                      isOverBudget ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {Math.round(spentPercentage)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 capitalize">{budget.period}</span>
                  <div className="flex items-center space-x-1">
                    {isOverBudget ? (
                      <AlertTriangle size={14} className="text-red-500" />
                    ) : (
                      <TrendingUp size={14} className="text-green-500" />
                    )}
                    <span className={isOverBudget ? 'text-red-600' : 'text-green-600'}>
                      {isOverBudget ? 'Over budget' : 'On track'}
                    </span>
                  </div>
                </div>

                {isNearLimit && !isOverBudget && (
                  <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-700">
                      You're approaching your budget limit. Consider reducing spending in this category.
                    </p>
                  </div>
                )}

                {isOverBudget && (
                  <div className="mt-3 p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-700">
                      You've exceeded your budget by ₹{(budget.spent - budget.amount).toLocaleString()}.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};