// Top Courses Card Component
import styles from "../styles/TopCoursesCard.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import SkeletonLoader from "./SkeletonLoader";

function TopCoursesCard() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://studypilot-backend.onrender.com/api/Courses");
        const formattedCourses = response.data.map(course => ({
          id: course.id,
          title: course.title,
          progress: course.progress,
          nextDeadline: course.nextDeadline,
        }));
        setCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return <SkeletonLoader/>;
  }

  return (
    <div className={styles.topCoursesCard}>
      <h3>Top Courses</h3>
      <ul className={styles.courseList}>
        {courses.map((course) => (
          <li key={course.id} className={styles.courseItem}>
            <div className={styles.courseTitle}>{course.title}</div>
            <div className={styles.courseProgress}>Progress: {course.progress}%</div>
            <div className={styles.courseDeadline}>Next Deadline: {course.nextDeadline}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopCoursesCard;