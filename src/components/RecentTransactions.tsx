import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Transaction } from '../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">Upload your transaction data to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="text-green-600" size={16} />
                ) : (
                  <ArrowDownLeft className="text-red-600" size={16} />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {transaction.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};