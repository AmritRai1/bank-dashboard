"use client";

import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// List of banks
const banks = [
  { id: 1, name: 'JPMorgan Chase', country: 'USA' },
  { id: 2, name: 'Bank of America', country: 'USA' },
  { id: 3, name: 'Citigroup', country: 'USA' },
  { id: 4, name: 'Wells Fargo', country: 'USA' },
  { id: 5, name: 'Goldman Sachs', country: 'USA' }
];

// Function to fetch insights from Grok
async function getGrokInsights(bankName) {
  const apiKey = process.env.NEXT_PUBLIC_GROK;
  console.log('Checking API key:', apiKey ? 'exists' : 'not found');

  if (!apiKey) {
    console.error('API key is missing');
    return { content: 'API key configuration error' };
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are Grok, analyzing GenAI initiatives in banking."
          },
          {
            role: "user",
            content: `What are the latest GenAI initiatives and news for ${bankName}?`
          }
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message;
  } catch (error) {
    console.error('Error details:', error);
    return { content: 'Unable to fetch insights at this time.' };
  }
}
const BankDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [bankInsights, setBankInsights] = useState({});
  const [loading, setLoading] = useState({});

  const countries = ['All', ...new Set(banks.map(bank => bank.country))];

  const fetchBankInsights = async (bankName) => {
    setLoading(prev => ({ ...prev, [bankName]: true }));
    try {
      const insights = await getGrokInsights(bankName);
      setBankInsights(prev => ({
        ...prev,
        [bankName]: insights.content
      }));
    } catch (error) {
      console.error('Error fetching insights:', error);
      setBankInsights(prev => ({
        ...prev,
        [bankName]: 'Error fetching insights. Please try again.'
      }));
    }
    setLoading(prev => ({ ...prev, [bankName]: false }));
  };

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || bank.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const formatInsights = (content) => {
    if (!content) return [];
    return content.split(/\d+\.\s+/).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Banking GenAI Intelligence Dashboard</h1>
          
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search banks..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 rounded-lg border border-gray-300"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBanks.map(bank => (
            <Card key={bank.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{bank.name}</CardTitle>
                <button 
                  onClick={() => fetchBankInsights(bank.name)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <RefreshCw 
                    className={`h-5 w-5 ${loading[bank.name] ? 'animate-spin' : ''}`} 
                  />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading[bank.name] ? (
                    <p className="text-gray-500">Loading insights...</p>
                  ) : bankInsights[bank.name] ? (
                    <div className="space-y-2">
                      {formatInsights(bankInsights[bank.name]).map((insight, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">{insight.trim()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Click refresh to load AI insights</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankDashboard;