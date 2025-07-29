import React from 'react';
import { Bot, CreditCard, PieChart, Upload, Crown, Menu } from 'lucide-react';
import { SubscriptionTier } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userTier: SubscriptionTier;
  setUserTier: (tier: SubscriptionTier) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userTier,
  setUserTier
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'chat', label: 'AI Advisor', icon: Bot },
    { id: 'upload', label: 'Transactions', icon: Upload },
    { id: 'budget', label: 'Budget', icon: CreditCard },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-blue-900">
              FinanceAI
            </h1>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown size={16} className={userTier === 'premium' ? 'text-yellow-500' : 'text-gray-400'} />
              <select
                value={userTier}
                onChange={(e) => setUserTier(e.target.value as SubscriptionTier)}
                className="bg-transparent border border-gray-300 rounded-md px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="free">Free Plan</option>
                <option value="premium">Premium Plan</option>
              </select>
            </div>
            
            <button className="md:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};