import React, { useMemo } from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle, Eye, Target } from 'lucide-react';
import { TitanicRecord } from '../data/titanicData';

interface PatternAnalysisProps {
  data: TitanicRecord[];
}

export const PatternAnalysis: React.FC<PatternAnalysisProps> = ({ data }) => {
  const patterns = useMemo(() => {
    // Survival patterns
    const totalPassengers = data.length;
    const survivors = data.filter(row => row.Survived === 1);
    const nonSurvivors = data.filter(row => row.Survived === 0);
    
    // Gender-based survival
    const femalePassengers = data.filter(row => row.Sex === 'female');
    const femaleSurvivors = femalePassengers.filter(row => row.Survived === 1);
    const malePassengers = data.filter(row => row.Sex === 'male');
    const maleSurvivors = malePassengers.filter(row => row.Survived === 1);

    // Class-based patterns
    const classPatterns = [1, 2, 3].map(pclass => {
      const classPassengers = data.filter(row => row.Pclass === pclass);
      const classSurvivors = classPassengers.filter(row => row.Survived === 1);
      return {
        class: pclass,
        total: classPassengers.length,
        survivors: classSurvivors.length,
        survivalRate: (classSurvivors.length / classPassengers.length) * 100
      };
    });

    // Age-based patterns
    const ageAnalysis = data
      .filter(row => typeof row.Age === 'number')
      .reduce((acc, row) => {
        const age = row.Age as number;
        if (age < 16) acc.children.push(row);
        else if (age >= 16 && age < 60) acc.adults.push(row);
        else acc.elderly.push(row);
        return acc;
      }, { children: [] as TitanicRecord[], adults: [] as TitanicRecord[], elderly: [] as TitanicRecord[] });

    // Family patterns
    const familyPatterns = data.reduce((acc, row) => {
      const familySize = row.SibSp + row.Parch + 1; // +1 for the person themselves
      if (familySize === 1) acc.alone.push(row);
      else if (familySize <= 4) acc.small.push(row);
      else acc.large.push(row);
      return acc;
    }, { alone: [] as TitanicRecord[], small: [] as TitanicRecord[], large: [] as TitanicRecord[] });

    // Port of embarkation patterns
    const portPatterns = ['S', 'C', 'Q'].map(port => {
      const portPassengers = data.filter(row => row.Embarked === port);
      const portSurvivors = portPassengers.filter(row => row.Survived === 1);
      const portNames = { S: 'Southampton', C: 'Cherbourg', Q: 'Queenstown' };
      return {
        port: portNames[port as keyof typeof portNames],
        code: port,
        total: portPassengers.length,
        survivors: portSurvivors.length,
        survivalRate: portPassengers.length > 0 ? (portSurvivors.length / portPassengers.length) * 100 : 0
      };
    });

    // Fare patterns
    const fareGroups = data
      .filter(row => typeof row.Fare === 'number')
      .reduce((acc, row) => {
        const fare = row.Fare as number;
        if (fare < 10) acc.low.push(row);
        else if (fare < 50) acc.medium.push(row);
        else acc.high.push(row);
        return acc;
      }, { low: [] as TitanicRecord[], medium: [] as TitanicRecord[], high: [] as TitanicRecord[] });

    return {
      overall: {
        totalPassengers,
        totalSurvivors: survivors.length,
        totalNonSurvivors: nonSurvivors.length,
        overallSurvivalRate: (survivors.length / totalPassengers) * 100
      },
      gender: {
        female: {
          total: femalePassengers.length,
          survivors: femaleSurvivors.length,
          rate: (femaleSurvivors.length / femalePassengers.length) * 100
        },
        male: {
          total: malePassengers.length,
          survivors: maleSurvivors.length,
          rate: (maleSurvivors.length / malePassengers.length) * 100
        }
      },
      class: classPatterns,
      age: {
        children: {
          total: ageAnalysis.children.length,
          survivors: ageAnalysis.children.filter(p => p.Survived === 1).length,
          rate: ageAnalysis.children.length > 0 ? 
            (ageAnalysis.children.filter(p => p.Survived === 1).length / ageAnalysis.children.length) * 100 : 0
        },
        adults: {
          total: ageAnalysis.adults.length,
          survivors: ageAnalysis.adults.filter(p => p.Survived === 1).length,
          rate: ageAnalysis.adults.length > 0 ? 
            (ageAnalysis.adults.filter(p => p.Survived === 1).length / ageAnalysis.adults.length) * 100 : 0
        },
        elderly: {
          total: ageAnalysis.elderly.length,
          survivors: ageAnalysis.elderly.filter(p => p.Survived === 1).length,
          rate: ageAnalysis.elderly.length > 0 ? 
            (ageAnalysis.elderly.filter(p => p.Survived === 1).length / ageAnalysis.elderly.length) * 100 : 0
        }
      },
      family: {
        alone: {
          total: familyPatterns.alone.length,
          survivors: familyPatterns.alone.filter(p => p.Survived === 1).length,
          rate: (familyPatterns.alone.filter(p => p.Survived === 1).length / familyPatterns.alone.length) * 100
        },
        small: {
          total: familyPatterns.small.length,
          survivors: familyPatterns.small.filter(p => p.Survived === 1).length,
          rate: (familyPatterns.small.filter(p => p.Survived === 1).length / familyPatterns.small.length) * 100
        },
        large: {
          total: familyPatterns.large.length,
          survivors: familyPatterns.large.filter(p => p.Survived === 1).length,
          rate: familyPatterns.large.length > 0 ? 
            (familyPatterns.large.filter(p => p.Survived === 1).length / familyPatterns.large.length) * 100 : 0
        }
      },
      ports: portPatterns,
      fare: {
        low: {
          total: fareGroups.low.length,
          survivors: fareGroups.low.filter(p => p.Survived === 1).length,
          rate: (fareGroups.low.filter(p => p.Survived === 1).length / fareGroups.low.length) * 100
        },
        medium: {
          total: fareGroups.medium.length,
          survivors: fareGroups.medium.filter(p => p.Survived === 1).length,
          rate: (fareGroups.medium.filter(p => p.Survived === 1).length / fareGroups.medium.length) * 100
        },
        high: {
          total: fareGroups.high.length,
          survivors: fareGroups.high.filter(p => p.Survived === 1).length,
          rate: (fareGroups.high.filter(p => p.Survived === 1).length / fareGroups.high.length) * 100
        }
      }
    };
  }, [data]);

  const PatternCard: React.FC<{
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    highlight?: boolean;
  }> = ({ title, icon: Icon, children, highlight = false }) => (
    <div className={`rounded-xl shadow-sm border p-6 ${
      highlight ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`h-5 w-5 ${highlight ? 'text-blue-600' : 'text-slate-600'}`} />
        <h3 className={`text-lg font-semibold ${highlight ? 'text-blue-900' : 'text-slate-900'}`}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const StatBar: React.FC<{ 
    label: string; 
    rate: number; 
    count: string;
    color: string;
  }> = ({ label, rate, count, color }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="text-right">
          <span className="text-sm font-semibold text-slate-900">{rate.toFixed(1)}%</span>
          <span className="text-xs text-slate-500 block">{count}</span>
        </div>
      </div>
      <div className="bg-slate-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${rate}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Pattern Analysis & Key Insights</h2>
        </div>
        
        {/* Overall Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{patterns.overall.totalPassengers}</div>
              <div className="text-sm opacity-90">Total Passengers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{patterns.overall.totalSurvivors}</div>
              <div className="text-sm opacity-90">Survivors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{patterns.overall.totalNonSurvivors}</div>
              <div className="text-sm opacity-90">Non-Survivors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{patterns.overall.overallSurvivalRate.toFixed(1)}%</div>
              <div className="text-sm opacity-90">Survival Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Patterns */}
        <PatternCard title="Gender-Based Survival Patterns" icon={Users} highlight>
          <div className="space-y-4">
            <StatBar 
              label="Female Passengers"
              rate={patterns.gender.female.rate}
              count={`${patterns.gender.female.survivors}/${patterns.gender.female.total}`}
              color="bg-pink-500"
            />
            <StatBar 
              label="Male Passengers"
              rate={patterns.gender.male.rate}
              count={`${patterns.gender.male.survivors}/${patterns.gender.male.total}`}
              color="bg-blue-500"
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Key Finding:</strong> Female passengers had a {(patterns.gender.female.rate - patterns.gender.male.rate).toFixed(1)} 
              percentage point higher survival rate, clearly demonstrating the "women first\" evacuation protocol.
            </p>
          </div>
        </PatternCard>

        {/* Class Patterns */}
        <PatternCard title="Passenger Class Impact" icon={TrendingUp}>
          <div className="space-y-4">
            {patterns.class.map((classData, index) => (
              <StatBar 
                key={classData.class}
                label={`Class ${classData.class}`}
                rate={classData.survivalRate}
                count={`${classData.survivors}/${classData.total}`}
                color={['bg-yellow-500', 'bg-green-500', 'bg-red-500'][index]}
              />
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Social Impact:</strong> First-class passengers had significantly better access to lifeboats, 
              with survival rates decreasing by class level.
            </p>
          </div>
        </PatternCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Patterns */}
        <PatternCard title="Age Group Analysis" icon={Users}>
          <div className="space-y-4">
            <StatBar 
              label="Children (< 16)"
              rate={patterns.age.children.rate}
              count={`${patterns.age.children.survivors}/${patterns.age.children.total}`}
              color="bg-green-500"
            />
            <StatBar 
              label="Adults (16-59)"
              rate={patterns.age.adults.rate}
              count={`${patterns.age.adults.survivors}/${patterns.age.adults.total}`}
              color="bg-blue-500"
            />
            <StatBar 
              label="Elderly (60+)"
              rate={patterns.age.elderly.rate}
              count={`${patterns.age.elderly.survivors}/${patterns.age.elderly.total}`}
              color="bg-orange-500"
            />
          </div>
        </PatternCard>

        {/* Family Size Patterns */}
        <PatternCard title="Family Size Impact" icon={Users}>
          <div className="space-y-4">
            <StatBar 
              label="Traveling Alone"
              rate={patterns.family.alone.rate}
              count={`${patterns.family.alone.survivors}/${patterns.family.alone.total}`}
              color="bg-red-500"
            />
            <StatBar 
              label="Small Family (2-4)"
              rate={patterns.family.small.rate}
              count={`${patterns.family.small.survivors}/${patterns.family.small.total}`}
              color="bg-green-500"
            />
            <StatBar 
              label="Large Family (5+)"
              rate={patterns.family.large.rate}
              count={`${patterns.family.large.survivors}/${patterns.family.large.total}`}
              color="bg-orange-500"
            />
          </div>
        </PatternCard>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Major Pattern Discoveries</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Chivalry Protocol</h4>
                <p className="text-sm text-green-800 mt-1">
                  "Women and children first" was clearly implemented, with women having {patterns.gender.female.rate.toFixed(1)}% 
                  survival rate vs {patterns.gender.male.rate.toFixed(1)}% for men.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Class Privilege</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Higher-class passengers had better survival rates, with first-class at {patterns.class[0].survivalRate.toFixed(1)}% 
                  vs third-class at {patterns.class[2].survivalRate.toFixed(1)}%.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900">Family Dynamics</h4>
                <p className="text-sm text-orange-800 mt-1">
                  Small families had the highest survival rate at {patterns.family.small.rate.toFixed(1)}%, 
                  while solo travelers had {patterns.family.alone.rate.toFixed(1)}%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};