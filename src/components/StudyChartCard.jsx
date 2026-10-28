import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

//Hours of completed study per day for the last week, from the progress endpoint
export default function StudyChartCard({ days = [] }) {
  const chartData = days.map(d => ({ day: d.label, hours: d.hours }));
  const hasStudy = chartData.some(d => d.hours > 0);

  return (
    <div style={{ marginTop: "1rem" }}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eef2f8" />
          <XAxis dataKey="day" interval={0} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
          <Tooltip cursor={{ fill: "#f1f5fb" }} formatter={(value) => [`${value} h`, 'Studied']} />
          <Bar dataKey="hours" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
      {!hasStudy && (
        <div style={{ textAlign: "center", color: "#64748b", marginTop: "1rem" }}>
          No study sessions yet. Tick one off to see it here.
        </div>
      )}
    </div>
  );
}
