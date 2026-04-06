'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 h-full">
      <div className="mb-6">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Analytics</p>
        <h3 className="text-lg font-semibold text-white">Spending by Category</h3>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition"
                />
              ))}
            </Pie>

            {/* Center Total */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-sm font-semibold"
            >
              ₹{data.reduce((acc, cur) => acc + cur.value, 0)}
            </text>

            <Tooltip
              formatter={(value, name) => [`₹${value}`, name]}
              contentStyle={{
                background: '#111827',
                border: '1px solid #27272a',
                borderRadius: '10px',
                color: '#e4e4e7',
                fontSize: '13px',
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: '12px',
                color: '#a1a1aa',
                paddingTop: '10px',
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
          <p className="text-zinc-600 text-xs">Add some to see insights.</p>
        </div>
      )}
    </Card>
  );
}