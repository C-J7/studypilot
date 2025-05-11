// Course Item for Top Courses
import styles from "./DashboardHome/DashboardHome.module.css";
import { motion } from "framer-motion";
import Progress from "@/components/ProgessDisplay";

function CourseItem({ code, title, progress, nextDeadline }) {
  return (
    <motion.div 
      className={styles.courseCardItem}
      whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
      transition={{ duration: 0.2 }}
    >
      <h4>{code} - {title}</h4>
      <p>Progress: {progress}%</p>
      <Progress value={progress} />
      <p style={{fontSize: '0.8rem', opacity: 0.8}}>Next Deadline: {nextDeadline}</p>
    </motion.div>
  );
}

export default CourseItem;