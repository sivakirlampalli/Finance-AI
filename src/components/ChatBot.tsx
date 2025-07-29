import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, SubscriptionTier } from '../types';

interface ChatBotProps {
  userTier: SubscriptionTier;
}

export const ChatBot: React.FC<ChatBotProps> = ({ userTier }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: `Hello! I'm your AI Financial Advisor. ${userTier === 'premium' ? 'As a premium member, you get unlimited advanced financial advice!' : 'Ask me about budgeting, saving, or investments. Upgrade to premium for unlimited access!'}`,
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      `Based on your query about "${userMessage.toLowerCase()}", here are some personalized recommendations: Consider setting aside 20% of your income for savings, diversify your investments across different asset classes, and track your spending patterns monthly.`,
      
      `Great question about "${userMessage.toLowerCase()}"! Here's my analysis: Start with an emergency fund covering 3-6 months of expenses, then focus on high-interest debt repayment, and consider low-cost index funds for long-term growth.`,
      
      `I understand you're asking about "${userMessage.toLowerCase()}". My suggestion: Create a 50/30/20 budget (needs/wants/savings), automate your savings transfers, and review your subscriptions monthly to eliminate unnecessary expenses.`,
      
      `Regarding "${userMessage.toLowerCase()}", here's what I recommend: Maximize employer 401(k) matching first, then contribute to a Roth IRA, and consider tax-loss harvesting for your taxable investments.`,
      
      `Thanks for your question about "${userMessage.toLowerCase()}". Here's my advice: Use the debt avalanche method for high-interest debt, negotiate better rates with creditors, and consider a balance transfer card if it saves you money.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check limits for free users
    if (userTier === 'free' && messages.filter(m => m.sender === 'user').length >= 5) {
      const limitMessage: ChatMessage = {
        id: Date.now().toString(),
        message: "You've reached the free plan limit of 5 questions. Upgrade to Premium for unlimited AI advice!",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const freeQuestionsUsed = messages.filter(m => m.sender === 'user').length;
  const freeQuestionsRemaining = Math.max(0, 5 - freeQuestionsUsed);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI Financial Advisor</h3>
              <p className="text-sm text-gray-500">
                {userTier === 'premium' ? 'Unlimited questions' : `${freeQuestionsRemaining} questions remaining`}
              </p>
            </div>
          </div>
          <Sparkles className="text-yellow-500" size={20} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'ai' && (
              <div className="p-2 bg-blue-100 rounded-full">
                <Bot size={16} className="text-blue-600" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.message}</p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="p-2 bg-gray-100 rounded-full">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about budgeting, investing, or saving..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={userTier === 'free' && freeQuestionsRemaining === 0}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || (userTier === 'free' && freeQuestionsRemaining === 0)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};