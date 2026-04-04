'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;

      const res = await fetch(`/api/alerts?user_id=${user.id}`);
      const data = await res.json();

      if (data.success) {
        setAlerts(data.data);
      }
    };

    fetchAlerts();
  }, [user]);

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-screen">

      {/* Header */}
      <div className="px-8 py-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">Alerts</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Stay updated with your financial warnings
        </p>
      </div>

      {/* Content */}
      <div className="p-8">

        {alerts.length === 0 ? (
          <div className="text-center mt-20 text-zinc-500">
            <p className="text-lg">No alerts</p>
            <p className="text-sm mt-2">You're managing your budget well</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert: any) => (
              <div
                key={alert.id}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl"
              >
                <p className="text-red-400 text-sm">
                  ⚠️ {alert.message}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}