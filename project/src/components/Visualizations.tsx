import React, { useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { TitanicRecord } from '../data/titanicData';

interface VisualizationsProps {
  data: TitanicRecord[];
}

export const Visualizations: React.FC<VisualizationsProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const survivalByClass = data.reduce((acc, row) => {
      const key = `Class ${row.Pclass}`;
      if (!acc[key]) acc[key] = { survived: 0, total: 0 };
      if (row.Survived === 1) acc[key].survived++;
      acc[key].total++;
      return acc;
    }, {} as Record<string, { survived: number; total: number }>);

    const survivalByGender = data.reduce((acc, row) => {
      if (!acc[row.Sex]) acc[row.Sex] = { survived: 0, total: 0 };
      if (row.Survived === 1) acc[row.Sex].survived++;
      acc[row.Sex].total++;
      return acc;
    }, {} as Record<string, { survived: number; total: number }>);

    const ageGroups = data
      .filter(row => typeof row.Age === 'number')
      .reduce((acc, row) => {
        const age = row.Age as number;
        let group = 'Unknown';
        if (age < 18) group = 'Child (0-17)';
        else if (age < 35) group = 'Young Adult (18-34)';
        else if (age < 55) group = 'Middle Age (35-54)';
        else group = 'Senior (55+)';
        
        if (!acc[group]) acc[group] = { survived: 0, total: 0 };
        if (row.Survived === 1) acc[group].survived++;
        acc[group].total++;
        return acc;
      }, {} as Record<string, { survived: number; total: number }>);

    const fareDistribution = data
      .filter(row => typeof row.Fare === 'number')
      .reduce((acc, row) => {
        const fare = row.Fare as number;
        let group = 'Unknown';
        if (fare < 10) group = 'Low (£0-9)';
        else if (fare < 30) group = 'Medium (£10-29)';
        else if (fare < 100) group = 'High (£30-99)';
        else group = 'Premium (£100+)';
        
        if (!acc[group]) acc[group] = 0;
        acc[group]++;
        return acc;
      }, {} as Record<string, number>);

    return { survivalByClass, survivalByGender, ageGroups, fareDistribution };
  }, [data]);

  const BarChart: React.FC<{ 
    data: Record<string, { survived: number; total: number }>;
    title: string;
    color: string;
  }> = ({ data, title, color }) => {
    const maxValue = Math.max(...Object.values(data).map(d => d.total));
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => {
            const survivalRate = (value.survived / value.total) * 100;
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{key}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {survivalRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {value.survived}/{value.total}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-slate-200 rounded-full h-4">
                    <div 
                      className={`${color} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${(value.total / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <div 
                    className="absolute top-0 bg-green-500 h-4 rounded-full opacity-70"
                    style={{ width: `${(value.survived / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const PieChart: React.FC<{ 
    data: Record<string, number>;
    title: string;
    colors: string[];
  }> = ({ data, title, colors }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value], index) => {
            const percentage = (value / total) * 100;
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}
                  ></div>
                  <span className="text-sm font-medium text-slate-700">{key}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">
                    {value} passengers
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Data Visualizations</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={chartData.survivalByClass}
          title="Survival Rate by Passenger Class"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        
        <BarChart 
          data={chartData.survivalByGender}
          title="Survival Rate by Gender"
          color="bg-gradient-to-r from-pink-500 to-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={chartData.ageGroups}
          title="Survival Rate by Age Group"
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        
        <PieChart 
          data={chartData.fareDistribution}
          title="Fare Distribution"
          colors={['bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500']}
        />
      </div>

      {/* Correlation Matrix Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Key Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Class Analysis</span>
            </div>
            <p className="text-sm text-blue-800">
              First-class passengers had the highest survival rate, indicating that social status 
              influenced survival chances.
            </p>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-pink-600" />
              <span className="font-medium text-pink-900">Gender Impact</span>
            </div>
            <p className="text-sm text-pink-800">
              The "women and children first" protocol is clearly visible in the survival rates, 
              with women having much higher survival rates.
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Age Factor</span>
            </div>
            <p className="text-sm text-green-800">
              Children had higher survival rates than adults, supporting the evacuation 
              priority given to vulnerable passengers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};