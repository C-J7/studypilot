
import styles from "../styles/StudyChartCard.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import  Card  from "@/components/BaseCard"
import SkeletonLoader from "./SkeletonLoader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function StudyChartCard() {
  const [studySessions, setStudySessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudySessions = async () => {
      try {
        const response = await axios.get("https://studypilot-backend.onrender.com/api//api/study-plan/{studyPlanId}/session/{sessionId}");
        const sessions = response.data.map(session => ({
          topic: session.topic,
          duration: (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60),
        }));
        setStudySessions(sessions);
      } catch (error) {
        console.error("Error fetching study sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudySessions();
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const defaultData = [
    { topic: "Mon", duration: 0 },
    { topic: "Tue", duration: 0 },
    { topic: "Wed", duration: 0 },
    { topic: "Thu", duration: 0 },
    { topic: "Fri", duration: 0 },
    { topic: "Sat", duration: 0 },
    { topic: "Sun", duration: 0 },
  ];

    const chartData = studySessions.length > 0 ? studySessions : defaultData;

  return (
    <Card title="" className={styles.studyTimeCard}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="topic" />
          <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="duration" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      {studySessions.length === 0 && (
        <div style={{ textAlign: "center", color: "#64748b", marginTop: "1rem" }}>
          No study sessions yet. Start studying to see your progress!
        </div>
      )}
    </Card>
  );
}