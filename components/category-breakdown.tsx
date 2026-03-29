'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

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
      console.error("Category breakdown error:", err);
      setData([]);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ₹${value}`}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `₹${Number(value)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No expenses yet. Add some to see insights.
        </div>
      )}
    </Card>
  );
}