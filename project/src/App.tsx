import React, { useState, useMemo } from 'react';
import { BarChart3, Database, TrendingUp, Users, Ship, AlertCircle, CheckCircle, Download, Filter, Eye } from 'lucide-react';
import { DataPreview } from './components/DataPreview';
import { StatisticalSummary } from './components/StatisticalSummary';
import { Visualizations } from './components/Visualizations';
import { DataCleaning } from './components/DataCleaning';
import { PatternAnalysis } from './components/PatternAnalysis';
import { titanicData } from './data/titanicData';

type Tab = 'overview' | 'cleaning' | 'statistics' | 'visualizations' | 'patterns';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [cleanedData, setCleanedData] = useState(titanicData);

  const stats = useMemo(() => {
    const totalRows = cleanedData.length;
    const missingValues = cleanedData.reduce((acc, row) => {
      Object.values(row).forEach(value => {
        if (value === '' || value === null || value === undefined) acc++;
      });
      return acc;
    }, 0);
    const completedRows = cleanedData.filter(row => 
      Object.values(row).every(value => value !== '' && value !== null && value !== undefined)
    ).length;
    
    return { totalRows, missingValues, completedRows };
  }, [cleanedData]);

  const tabs = [
    { id: 'overview', label: 'Data Overview', icon: Database },
    { id: 'cleaning', label: 'Data Cleaning', icon: Filter },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'visualizations', label: 'Visualizations', icon: TrendingUp },
    { id: 'patterns', label: 'Pattern Analysis', icon: Users }
  ];

  const exportData = () => {
    const csvContent = [
      Object.keys(cleanedData[0]).join(','),
      ...cleanedData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_titanic_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Ship className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Titanic Dataset Analysis</h1>
                <p className="text-sm text-slate-600">Exploratory Data Analysis & Data Cleaning</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-600">Total Records: {stats.totalRows}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-600">Complete: {stats.completedRows}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-600">Missing: {stats.missingValues}</span>
                </div>
              </div>
              
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <DataPreview data={cleanedData} stats={stats} />}
        {activeTab === 'cleaning' && <DataCleaning data={cleanedData} onDataChange={setCleanedData} />}
        {activeTab === 'statistics' && <StatisticalSummary data={cleanedData} />}
        {activeTab === 'visualizations' && <Visualizations data={cleanedData} />}
        {activeTab === 'patterns' && <PatternAnalysis data={cleanedData} />}
      </main>
    </div>
  );
}

export default App;