import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { TitanicRecord } from '../data/titanicData';

interface StatisticalSummaryProps {
  data: TitanicRecord[];
}

export const StatisticalSummary: React.FC<StatisticalSummaryProps> = ({ data }) => {
  const stats = useMemo(() => {
    const numericData = data.map(row => ({
      age: typeof row.Age === 'number' ? row.Age : null,
      fare: typeof row.Fare === 'number' ? row.Fare : null,
      sibsp: row.SibSp,
      parch: row.Parch,
      pclass: row.Pclass
    }));

    const ages = numericData.map(d => d.age).filter(age => age !== null) as number[];
    const fares = numericData.map(d => d.fare).filter(fare => fare !== null) as number[];

    const calculateStats = (values: number[]) => {
      if (values.length === 0) return { mean: 0, median: 0, std: 0, min: 0, max: 0 };
      
      const sorted = [...values].sort((a, b) => a - b);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);
      
      return {
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        std: Number(std.toFixed(2)),
        min: Math.min(...values),
        max: Math.max(...values)
      };
    };

    const survivalRate = (data.filter(row => row.Survived === 1).length / data.length) * 100;
    const genderDistribution = {
      male: data.filter(row => row.Sex === 'male').length,
      female: data.filter(row => row.Sex === 'female').length
    };
    
    const classDistribution = {
      first: data.filter(row => row.Pclass === 1).length,
      second: data.filter(row => row.Pclass === 2).length,
      third: data.filter(row => row.Pclass === 3).length
    };

    const embarkedDistribution = {
      S: data.filter(row => row.Embarked === 'S').length,
      C: data.filter(row => row.Embarked === 'C').length,
      Q: data.filter(row => row.Embarked === 'Q').length,
      unknown: data.filter(row => row.Embarked === '').length
    };

    return {
      age: calculateStats(ages),
      fare: calculateStats(fares),
      survivalRate,
      genderDistribution,
      classDistribution,
      embarkedDistribution,
      totalRecords: data.length
    };
  }, [data]);

  const StatCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const StatRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-slate-100 last:border-b-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Statistical Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Survival Rate</p>
                <p className="text-2xl font-bold">{stats.survivalRate.toFixed(1)}%</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Avg Age</p>
                <p className="text-2xl font-bold">{stats.age.mean}</p>
                <p className="text-xs opacity-80">years</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Avg Fare</p>
                <p className="text-2xl font-bold">£{stats.fare.mean}</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Records</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Age Statistics */}
        <StatCard title="Age Distribution" icon={Users}>
          <div className="space-y-1">
            <StatRow label="Mean" value={`${stats.age.mean} years`} />
            <StatRow label="Median" value={`${stats.age.median} years`} />
            <StatRow label="Std Dev" value={`${stats.age.std} years`} />
            <StatRow label="Min" value={`${stats.age.min} years`} />
            <StatRow label="Max" value={`${stats.age.max} years`} />
          </div>
        </StatCard>

        {/* Fare Statistics */}
        <StatCard title="Fare Distribution" icon={DollarSign}>
          <div className="space-y-1">
            <StatRow label="Mean" value={`£${stats.fare.mean}`} />
            <StatRow label="Median" value={`£${stats.fare.median}`} />
            <StatRow label="Std Dev" value={`£${stats.fare.std}`} />
            <StatRow label="Min" value={`£${stats.fare.min}`} />
            <StatRow label="Max" value={`£${stats.fare.max}`} />
          </div>
        </StatCard>

        {/* Gender Distribution */}
        <StatCard title="Gender Distribution" icon={Users}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Male</span>
                <span className="text-sm font-semibold text-slate-900">{stats.genderDistribution.male}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(stats.genderDistribution.male / stats.totalRecords) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Female</span>
                <span className="text-sm font-semibold text-slate-900">{stats.genderDistribution.female}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full" 
                  style={{ width: `${(stats.genderDistribution.female / stats.totalRecords) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </StatCard>

        {/* Class Distribution */}
        <StatCard title="Passenger Class" icon={TrendingUp}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">First Class</span>
                <span className="text-sm font-semibold text-slate-900">{stats.classDistribution.first}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gold-500 h-2 rounded-full bg-yellow-500" 
                  style={{ width: `${(stats.classDistribution.first / stats.totalRecords) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Second Class</span>
                <span className="text-sm font-semibold text-slate-900">{stats.classDistribution.second}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.classDistribution.second / stats.totalRecords) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Third Class</span>
                <span className="text-sm font-semibold text-slate-900">{stats.classDistribution.third}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(stats.classDistribution.third / stats.totalRecords) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </StatCard>

        {/* Embarkation Distribution */}
        <StatCard title="Port of Embarkation" icon={Users}>
          <div className="space-y-1">
            <StatRow label="Southampton (S)" value={stats.embarkedDistribution.S} />
            <StatRow label="Cherbourg (C)" value={stats.embarkedDistribution.C} />
            <StatRow label="Queenstown (Q)" value={stats.embarkedDistribution.Q} />
            <StatRow label="Unknown" value={stats.embarkedDistribution.unknown} />
          </div>
        </StatCard>
      </div>
    </div>
  );
};