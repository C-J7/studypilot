import styles from "../styles/StudyChartCard.module.css";
import Card from "@/components/BaseCard"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

//Hours of completed study per day for the last week, from the progress endpoint
export default function StudyChartCard({ days = [] }) {
  const chartData = days.map(d => ({ day: d.label, hours: d.hours }));
  const hasStudy = chartData.some(d => d.hours > 0);

  return (
    <Card title="" className={styles.studyTimeCard}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" interval={0} />
          <YAxis allowDecimals={false} label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value} h`, 'Studied']} />
          <Bar dataKey="hours" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      {!hasStudy && (
        <div style={{ textAlign: "center", color: "#64748b", marginTop: "1rem" }}>
          No study sessions yet. Start studying to see your progress!
        </div>
      )}
    </Card>
  );
}
