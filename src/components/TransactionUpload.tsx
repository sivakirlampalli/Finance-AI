import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Transaction, SubscriptionTier } from '../types';

interface TransactionUploadProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  userTier: SubscriptionTier;
}

export const TransactionUpload: React.FC<TransactionUploadProps> = ({
  transactions,
  setTransactions,
  userTier
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const maxTransactions = userTier === 'premium' ? Infinity : 100;
  const currentTransactionCount = transactions.length;

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
    'Income', 'Investment', 'Other'
  ];

  const categorizeTransaction = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('food') || desc.includes('restaurant') || desc.includes('dining')) {
      return 'Food & Dining';
    }
    if (desc.includes('gas') || desc.includes('uber') || desc.includes('taxi') || desc.includes('bus')) {
      return 'Transportation';
    }
    if (desc.includes('amazon') || desc.includes('shopping') || desc.includes('store')) {
      return 'Shopping';
    }
    if (desc.includes('movie') || desc.includes('netflix') || desc.includes('spotify')) {
      return 'Entertainment';
    }
    if (desc.includes('electric') || desc.includes('water') || desc.includes('internet') || desc.includes('phone')) {
      return 'Bills & Utilities';
    }
    if (desc.includes('salary') || desc.includes('income') || desc.includes('paycheck')) {
      return 'Income';
    }
    return 'Other';
  };

  const generateSampleData = (): Transaction[] => {
    const sampleTransactions = [
      { description: 'Salary Credit', amount: 75000, type: 'income' as const },
      { description: 'Grocery Shopping - BigBazar', amount: 2500, type: 'expense' as const },
      { description: 'Uber Ride', amount: 180, type: 'expense' as const },
      { description: 'Netflix Subscription', amount: 199, type: 'expense' as const },
      { description: 'Restaurant - Pizza Hut', amount: 850, type: 'expense' as const },
      { description: 'Electricity Bill', amount: 1200, type: 'expense' as const },
      { description: 'Amazon Purchase', amount: 1500, type: 'expense' as const },
      { description: 'Freelance Payment', amount: 15000, type: 'income' as const },
      { description: 'Movie Tickets', amount: 400, type: 'expense' as const },
      { description: 'Gas Station', amount: 2000, type: 'expense' as const },
    ];

    return sampleTransactions.map((t, index) => ({
      id: Date.now().toString() + index,
      ...t,
      category: categorizeTransaction(t.description),
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (userTier === 'free' && currentTransactionCount >= maxTransactions) {
      setErrorMessage('Free plan limit reached. Upgrade to Premium for unlimited transactions!');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    
    // Simulate file processing
    setTimeout(() => {
      try {
        const sampleData = generateSampleData();
        const limitedData = userTier === 'free' 
          ? sampleData.slice(0, maxTransactions - currentTransactionCount)
          : sampleData;
        
        setTransactions([...transactions, ...limitedData]);
        setUploadStatus('success');
        setErrorMessage('');
      } catch (error) {
        setUploadStatus('error');
        setErrorMessage('Failed to process file. Please try again.');
      }
    }, 2000);
  };

  const handleSampleData = () => {
    if (userTier === 'free' && currentTransactionCount >= maxTransactions) {
      setErrorMessage('Free plan limit reached. Upgrade to Premium for unlimited transactions!');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setTimeout(() => {
      const sampleData = generateSampleData();
      const limitedData = userTier === 'free' 
        ? sampleData.slice(0, maxTransactions - currentTransactionCount)
        : sampleData;
      
      setTransactions([...transactions, ...limitedData]);
      setUploadStatus('success');
    }, 1000);
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Upload</h2>
        <p className="text-gray-600">
          Upload your transaction data to get AI-powered insights and categorization.
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span className={`px-3 py-1 rounded-full ${
            userTier === 'premium' 
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}>
            {userTier === 'premium' ? 'Unlimited' : `${currentTransactionCount}/${maxTransactions}`} transactions
          </span>
          <span className="text-gray-500">
            Supports CSV, JSON formats
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {uploadStatus === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upload Transaction Data
            </h3>
            <p className="text-gray-600 mb-6">
              Drag and drop your CSV or JSON file here, or click to browse
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="file"
                accept=".csv,.json"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
              >
                <FileText size={18} />
                <span>Choose File</span>
              </label>
              
              <button
                onClick={handleSampleData}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center space-x-2"
              >
                <Upload size={18} />
                <span>Use Sample Data</span>
              </button>
            </div>
          </div>
        )}

        {uploadStatus === 'uploading' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Transactions</h3>
            <p className="text-gray-600">
              Analyzing and categorizing your financial data...
            </p>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your transactions have been processed and categorized using AI.
            </p>
            <button
              onClick={resetUpload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload More Data
            </button>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Failed</h3>
            <p className="text-red-600 mb-6">{errorMessage}</p>
            <button
              onClick={resetUpload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Transaction Categories */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Categorization</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(category => {
              const count = transactions.filter(t => t.category === category).length;
              return count > 0 ? (
                <div key={category} className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="font-medium text-gray-800">{category}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{count}</p>
                  <p className="text-xs text-gray-500">transactions</p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};