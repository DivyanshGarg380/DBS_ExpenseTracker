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
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ₹${value}`}
              outerRadius={90}
              innerRadius={40}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${Number(value)}`}
              contentStyle={{
                background: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                color: '#f4f4f5',
                fontSize: '13px',
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{value}</span>
              )}
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