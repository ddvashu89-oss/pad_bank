import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, Gift, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { LoadingBlock } from '../components/Spinner.jsx';
import { fetchAnalytics } from '../services/analyticsService.js';
import { formatNumber } from '../utils/format.js';

// Validated categorical palette (dataviz skill, default order) — slot 1 & 2.
const COLOR_ADDED = '#2a78d6';
const COLOR_DISTRIBUTED = '#eb6834';
const GRID = '#e1e0d9';
const AXIS_TEXT = '#898781';

function ChartCard({ title, subtitle, empty, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-neutral-900">{title}</h2>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {empty ? (
        <p className="text-sm text-neutral-500 py-10 text-center">Not enough data yet.</p>
      ) : (
        children
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-medium text-neutral-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-neutral-700">{p.name}:</span>
          <span className="font-medium">{formatNumber(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load analytics'));
  }, []);

  if (error) {
    return <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>;
  }

  if (!data) {
    return <LoadingBlock label="Loading analytics…" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Distributions" value={formatNumber(data.totalDistributions)} icon={Gift} />
        <StatCard label="Active Ladies" value={formatNumber(data.activeLadies)} icon={Users} />
        <StatCard label="Avg Pads / Visit" value={data.avgPadsPerVisit} icon={TrendingUp} />
      </div>

      <ChartCard
        title="Stock Added vs Pads Distributed"
        subtitle="Monthly totals from actual stock and distribution records"
        empty={data.monthlyTrend.length === 0}
      >
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={data.monthlyTrend} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                axisLine={{ stroke: GRID }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatNumber(v)}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Line
                type="monotone"
                dataKey="added"
                name="Added"
                stroke={COLOR_ADDED}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: COLOR_ADDED }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="distributed"
                name="Distributed"
                stroke={COLOR_DISTRIBUTED}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: COLOR_DISTRIBUTED }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Top Recipients"
        subtitle="Ladies who have received the most pads in total"
        empty={data.topLadies.length === 0}
      >
        <div style={{ width: '100%', height: Math.max(120, data.topLadies.length * 48) }}>
          <ResponsiveContainer>
            <BarChart
              data={data.topLadies}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 0, bottom: 0 }}
              barCategoryGap={12}
            >
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                axisLine={{ stroke: GRID }}
                tickLine={false}
                tickFormatter={(v) => formatNumber(v)}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#0b0b0b', fontSize: 13 }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 text-sm">
                      <p className="font-medium text-neutral-900">{p.name}</p>
                      <p className="text-neutral-600">{formatNumber(p.totalPads)} pads · {p.visits} visits</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="totalPads" name="Pads received" fill={COLOR_ADDED} radius={[0, 4, 4, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
