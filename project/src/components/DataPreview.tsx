import React, { useState } from 'react';
import { Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { TitanicRecord } from '../data/titanicData';

interface DataPreviewProps {
  data: TitanicRecord[];
  stats: {
    totalRows: number;
    missingValues: number;
    completedRows: number;
  };
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, stats }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(data.length / recordsPerPage);
  
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentData = data.slice(startIndex, startIndex + recordsPerPage);

  const columns = Object.keys(data[0]);
  
  const getColumnStats = (column: string) => {
    const values = data.map(row => row[column as keyof TitanicRecord]);
    const missing = values.filter(val => val === '' || val === null || val === undefined).length;
    const filled = values.length - missing;
    return { missing, filled, fillRate: (filled / values.length) * 100 };
  };

  const getCellValue = (value: any) => {
    if (value === '' || value === null || value === undefined) {
      return <span className="text-red-500 italic">Missing</span>;
    }
    return String(value);
  };

  const getCellClass = (value: any) => {
    if (value === '' || value === null || value === undefined) {
      return "px-3 py-2 text-sm bg-red-50 border-l-2 border-red-300";
    }
    return "px-3 py-2 text-sm";
  };

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Dataset Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Total Records</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalRows}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Complete Records</p>
                <p className="text-2xl font-bold text-green-700">{stats.completedRows}</p>
                <p className="text-xs text-green-600">{((stats.completedRows / stats.totalRows) * 100).toFixed(1)}% complete</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">Missing Values</p>
                <p className="text-2xl font-bold text-orange-700">{stats.missingValues}</p>
                <p className="text-xs text-orange-600">Across all fields</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Column Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Column Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.map(column => {
              const columnStats = getColumnStats(column);
              return (
                <div key={column} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-900 text-sm">{column}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      columnStats.fillRate > 90 
                        ? 'bg-green-100 text-green-700' 
                        : columnStats.fillRate > 70 
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {columnStats.fillRate.toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>Filled: {columnStats.filled}</p>
                    <p>Missing: {columnStats.missing}</p>
                  </div>
                  <div className="mt-2 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        columnStats.fillRate > 90 ? 'bg-green-500' : columnStats.fillRate > 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${columnStats.fillRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Sample Data</h3>
          <p className="text-sm text-slate-600 mt-1">
            Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, data.length)} of {data.length} records
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {columns.map(column => (
                  <th key={column} className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentData.map((row, index) => (
                <tr key={row.PassengerId} className="hover:bg-slate-50">
                  {columns.map(column => (
                    <td key={column} className={getCellClass(row[column as keyof TitanicRecord])}>
                      {getCellValue(row[column as keyof TitanicRecord])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};