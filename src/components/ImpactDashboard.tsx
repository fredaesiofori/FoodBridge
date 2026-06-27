import React, { useState } from 'react';
import { FoodDrop } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Sparkles, Award, HeartHandshake, ChevronDown, ChevronUp, Activity } from 'lucide-react';

interface ImpactDashboardProps {
  drops: FoodDrop[];
}

// Historical daily trends over the last 7 days (baseline + live today)
const HISTORICAL_7_DAYS = [
  { day: 'Sat', fullDay: 'Saturday', meals: 340, rescued: 340 },
  { day: 'Sun', fullDay: 'Sunday', meals: 420, rescued: 420 },
  { day: 'Mon', fullDay: 'Monday', meals: 380, rescued: 380 },
  { day: 'Tue', fullDay: 'Tuesday', meals: 510, rescued: 510 },
  { day: 'Wed', fullDay: 'Wednesday', meals: 490, rescued: 490 },
  { day: 'Thu', fullDay: 'Thursday', meals: 580, rescued: 580 },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Fresh Produce': '#386A20',
  'Bakery & Bread': '#558B2F',
  'Prepared Meals': '#7CB342',
  'Catering & Trays': '#9CCC65',
  'Dairy & Refrigerated': '#C5E1A5',
  'Pantry & Dry': '#2C5319',
  'Other': '#4D7C0F'
};

const PIE_PALETTE = ['#386A20', '#558B2F', '#7CB342', '#9CCC65', '#C5E1A5', '#2C5319'];

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ drops }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate live today's meals rescued from claimed/picked up items + baseline today
  const liveTodayMeals = drops
    .filter(d => d.status === 'claimed' || d.status === 'picked_up')
    .reduce((sum, d) => sum + d.mealsEstimated, 0) + 185;

  const lineChartData = [
    ...HISTORICAL_7_DAYS,
    { day: 'Today', fullDay: 'Friday (Live)', meals: liveTodayMeals, rescued: liveTodayMeals }
  ];

  const total7DayMeals = lineChartData.reduce((acc, curr) => acc + curr.meals, 0);

  // Category distribution calculation
  const categoryMap: Record<string, number> = {
    'Fresh Produce': 320,
    'Bakery & Bread': 260,
    'Prepared Meals': 210,
    'Catering & Trays': 150,
    'Dairy & Refrigerated': 95,
  };

  drops.forEach(d => {
    categoryMap[d.category] = (categoryMap[d.category] || 0) + d.mealsEstimated;
  });

  const pieChartData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  // Custom tooltip for line chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1D1B16] text-white p-3 rounded-xl shadow-lg border border-[#386A20]/40 text-xs">
          <p className="font-bold text-[#A5D6A7] mb-1">{data.fullDay}</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7CB342]"></span>
            <span>Meals Rescued: <strong className="text-white text-sm">{payload[0].value}</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = pieChartData.reduce((s, item) => s + item.value, 0);
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-[#1D1B16] text-white p-3 rounded-xl shadow-lg border border-[#386A20]/40 text-xs">
          <p className="font-bold mb-1" style={{ color: data.payload.fill || '#A5D6A7' }}>{data.name}</p>
          <p className="text-gray-200">{data.value} meals ({percent}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mb-8 bg-white border border-[#E6E2D3] rounded-3xl overflow-hidden shadow-xs transition-all duration-300">
      {/* Dashboard Section Header */}
      <div className="bg-[#F3F0E6] px-6 py-4 border-b border-[#E6E2D3] flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#386A20] text-white rounded-2xl shadow-xs flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#A5D6A7]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1D1B16] tracking-tight">Community Impact Dashboard</h2>
              <span className="bg-[#386A20]/15 text-[#386A20] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Telemetry
              </span>
            </div>
            <p className="text-xs text-[#52514A] mt-0.5">
              Real-time rescue metrics and food surplus category distribution across local partner shelters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#E6E2D3] text-xs font-semibold text-[#1D1B16]">
            <Award className="w-4 h-4 text-[#386A20]" />
            <span>7-Day Total: <strong className="text-[#386A20] text-sm ml-0.5">{total7DayMeals.toLocaleString()}</strong> meals</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 bg-[#E6E2D3]/60 hover:bg-[#E6E2D3] text-[#1D1B16] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand Metrics'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dashboard Charts Content Grid */}
      {isExpanded && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FDFCF8]">
          {/* Left Chart: 7-Day Line Chart Trends */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E6E2D3] shadow-2xs flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1D1B16] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#386A20]" />
                  Meals Rescued Trends (Last 7 Days)
                </h3>
                <p className="text-[11px] text-[#79776E] mt-0.5">Daily volume of nutritious surplus redirected before expiry</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#386A20] bg-[#386A20]/10 px-2 py-1 rounded-lg">
                  +18.4% vs prev week
                </span>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E2D3" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#79776E" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={{ stroke: '#E6E2D3' }}
                  />
                  <YAxis 
                    stroke="#79776E" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={{ stroke: '#E6E2D3' }}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="meals" 
                    stroke="#386A20" 
                    strokeWidth={3}
                    dot={{ fill: '#386A20', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 7, fill: '#7CB342', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Chart: Food Category Pie Chart Distribution */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E6E2D3] shadow-2xs flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#1D1B16] flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#386A20]" />
                Rescued Category Breakdown
              </h3>
              <p className="text-[11px] text-[#79776E] mt-0.5">Distribution of rescued surplus food by nutritional grouping</p>
            </div>

            <div className="w-full h-64 sm:h-72 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name] || PIE_PALETTE[index % PIE_PALETTE.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value: string) => <span className="text-[11px] font-medium text-[#52514A] mr-2">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center donut stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                <HeartHandshake className="w-5 h-5 text-[#386A20] mb-0.5 opacity-80" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#79776E]">Total</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
