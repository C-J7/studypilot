
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
        const response = await axios.get("https://studypilot-backend.onrender.com/api/StudySessions");
        const sessions = response.data.map(session => ({
          topic: session.topic,
          duration: (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60), // Duration in minutes
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

  return (
    <Card title="Time Spent Studying" className={styles.studyTimeCard}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={studySessions}>
          <XAxis dataKey="topic" />
          <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="duration" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}