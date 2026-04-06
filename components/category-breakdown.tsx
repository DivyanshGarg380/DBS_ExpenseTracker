'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa'];

export function CategoryBreakdown({ userId }: { userId: number }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/analytics?user_id=${userId}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.categoryData)) {
        const formatted = result.categoryData.map((item: any) => ({
          name: item.category,
          value: Number(item.total) || 0,
        }));
        setData(formatted);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error('Category breakdown error:', err);
      setData([]);
    }
  };

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  const renderLabel = ({ percent, value }: any) => {
    if (percent < 0.06) return ''; 
    return `₹${value}`;
  };

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 h-full">
      <div className="mb-6">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
          Analytics
        </p>
        <h3 className="text-lg font-semibold text-white">
          Spending by Category
        </h3>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={115}
              paddingAngle={4}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>

            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-lg font-bold"
            >
              ₹{total}
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-zinc-400 text-xs"
            >
              Total
            </text>

            <Tooltip
              formatter={(value: number) => `₹${value}`}
              contentStyle={{
                background: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                padding: '6px 10px',
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: '12px',
                color: '#a1a1aa',
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-72 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 text-xl">₹</span>
          </div>
          <p className="text-zinc-500 text-sm">No expenses yet.</p>
          <p className="text-zinc-600 text-xs">
            Add some to see insights.
          </p>
        </div>
      )}
    </Card>
  );
}