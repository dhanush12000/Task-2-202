import React, { useState } from 'react';
import { Filter, RefreshCw, AlertTriangle, CheckCircle, Trash2, Edit3 } from 'lucide-react';
import { TitanicRecord } from '../data/titanicData';

interface DataCleaningProps {
  data: TitanicRecord[];
  onDataChange: (data: TitanicRecord[]) => void;
}

export const DataCleaning: React.FC<DataCleaningProps> = ({ data, onDataChange }) => {
  const [cleaningHistory, setCleaningHistory] = useState<string[]>([]);

  const handleFillMissingAges = () => {
    const ages = data.map(row => typeof row.Age === 'number' ? row.Age : null).filter(age => age !== null) as number[];
    const meanAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    
    const cleanedData = data.map(row => ({
      ...row,
      Age: typeof row.Age === 'number' ? row.Age : Math.round(meanAge)
    }));
    
    onDataChange(cleanedData);
    setCleaningHistory(prev => [...prev, `Filled missing ages with mean (${Math.round(meanAge)} years)`]);
  };

  const handleFillMissingFares = () => {
    const fares = data.map(row => typeof row.Fare === 'number' ? row.Fare : null).filter(fare => fare !== null) as number[];
    const medianFare = fares.sort((a, b) => a - b)[Math.floor(fares.length / 2)];
    
    const cleanedData = data.map(row => ({
      ...row,
      Fare: typeof row.Fare === 'number' ? row.Fare : medianFare
    }));
    
    onDataChange(cleanedData);
    setCleaningHistory(prev => [...prev, `Filled missing fares with median (£${medianFare})`]);
  };

  const handleFillMissingEmbarkation = () => {
    const embarkedCounts = data.reduce((acc, row) => {
      if (row.Embarked && row.Embarked !== '') {
        acc[row.Embarked] = (acc[row.Embarked] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonPort = Object.keys(embarkedCounts).reduce((a, b) => 
      embarkedCounts[a] > embarkedCounts[b] ? a : b
    );
    
    const cleanedData = data.map(row => ({
      ...row,
      Embarked: row.Embarked === '' ? mostCommonPort : row.Embarked
    }));
    
    onDataChange(cleanedData);
    setCleaningHistory(prev => [...prev, `Filled missing embarkation ports with most common (${mostCommonPort})`]);
  };

  const handleRemoveIncompleteRecords = () => {
    const completeRecords = data.filter(row => 
      Object.values(row).every(value => value !== '' && value !== null && value !== undefined)
    );
    
    const removedCount = data.length - completeRecords.length;
    onDataChange(completeRecords);
    setCleaningHistory(prev => [...prev, `Removed ${removedCount} incomplete records`]);
  };

  const handleResetData = () => {
    // This would reset to original data - for demo purposes, we'll clear history
    setCleaningHistory([]);
  };

  const getMissingValueStats = () => {
    const columns = Object.keys(data[0]) as (keyof TitanicRecord)[];
    return columns.map(column => {
      const missing = data.filter(row => row[column] === '' || row[column] === null || row[column] === undefined).length;
      const percentage = (missing / data.length) * 100;
      return { column, missing, percentage };
    }).filter(stat => stat.missing > 0);
  };

  const missingStats = getMissingValueStats();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Data Cleaning Operations</h2>
        </div>

        {/* Missing Data Overview */}
        {missingStats.length > 0 && (
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Missing Data Detected</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {missingStats.map(stat => (
                <div key={stat.column} className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">{stat.column}</span>
                    <span className="text-sm text-orange-600">{stat.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="text-sm text-slate-600">{stat.missing} missing values</div>
                  <div className="mt-2 bg-orange-100 rounded-full h-1.5">
                    <div 
                      className="bg-orange-500 h-1.5 rounded-full" 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cleaning Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Fill Missing Values</h3>
            
            <button
              onClick={handleFillMissingAges}
              className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-blue-900">Fill Missing Ages</div>
                <div className="text-sm text-blue-700">Replace with mean age</div>
              </div>
              <Edit3 className="h-5 w-5 text-blue-600" />
            </button>
            
            <button
              onClick={handleFillMissingFares}
              className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-green-900">Fill Missing Fares</div>
                <div className="text-sm text-green-700">Replace with median fare</div>
              </div>
              <Edit3 className="h-5 w-5 text-green-600" />
            </button>
            
            <button
              onClick={handleFillMissingEmbarkation}
              className="w-full flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-purple-900">Fill Missing Ports</div>
                <div className="text-sm text-purple-700">Replace with most common port</div>
              </div>
              <Edit3 className="h-5 w-5 text-purple-600" />
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Remove Data</h3>
            
            <button
              onClick={handleRemoveIncompleteRecords}
              className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-red-900">Remove Incomplete Records</div>
                <div className="text-sm text-red-700">Delete rows with missing values</div>
              </div>
              <Trash2 className="h-5 w-5 text-red-600" />
            </button>
            
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-slate-900">Reset Changes</div>
                <div className="text-sm text-slate-700">Clear cleaning history</div>
              </div>
              <RefreshCw className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Cleaning History */}
        {cleaningHistory.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-900">Cleaning History</h3>
            </div>
            <div className="space-y-2">
              {cleaningHistory.map((action, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-green-800">{action}</span>
                  <span className="text-xs text-green-600 ml-auto">Step {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};