import React from 'react';
import { PieChart } from 'lucide-react';
import { SpendingInsight } from '../types';

interface SpendingChartProps {
  data: SpendingInsight[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <PieChart className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Spending by Category</h3>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No spending data available</p>
          <p className="text-sm text-gray-400 mt-1">Upload transactions to see insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">{item.category}</span>
                  <span className="text-sm font-medium text-gray-600">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.percentage.toFixed(1)}% of total spending
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};