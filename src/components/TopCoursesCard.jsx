import styles from '@/styles/TopCoursesCard.module.css';
import PropTypes from 'prop-types';

/**
 * TopCoursesCard displays a list of the user's top courses with progress bars.
 * @param {Object[]} courses - Array of syllabus/course objects.
 * @param {Object[]} progress - Array of progress objects (with course id or title and percent).
 */
const TopCoursesCard = ({ courses = [], progress = [] }) => {
  // Map course progress by course id or title for quick lookup
  const progressMap = {};
  progress?.forEach(p => {
    if (p.courseId) progressMap[p.courseId] = p.percent;
    if (p.title) progressMap[p.title] = p.percent;
  });

  // Show up to 3 top courses by progress (or just first 3 if no progress)
  const topCourses = courses.slice(0, 3);

  return (
    <div className={styles.topCoursesCard}>
      <h3>Top Courses</h3>
      <div className={styles.coursesList}>
        {topCourses.length === 0 ? (
          <div className={styles.empty}>No courses found.</div>
        ) : (
          topCourses.map((course, idx) => {
            const courseTitle = course.title || course.name || `Course ${idx + 1}`;
            const percent = progressMap[course.id] || progressMap[courseTitle] || 0;
            return (
              <div key={course.id || courseTitle} className={styles.courseItem}>
                <div className={styles.courseHeader}>
                  <span className={styles.courseName}>{courseTitle}</span>
                  <span className={styles.coursePercent}>{percent}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

TopCoursesCard.propTypes = {
  courses: PropTypes.array,
  progress: PropTypes.array,
};

export default TopCoursesCard;
