import styles from '@/styles/TopCoursesCard.module.css';
import PropTypes from 'prop-types';

const TopCoursesCard = ({ courses = [], progress = [] }) => {
  const progressArr = Array.isArray(progress) ? progress : [];
  const progressMap = {};
  progressArr.forEach(p => {
    if (p.courseId) progressMap[p.courseId] = p.percent;
    if (p.title) progressMap[p.title] = p.percent;
  });

  const topCourses = courses.slice(0, 4);

  return (
    <div className={styles.topCoursesCard}>
      <h3>Top Courses</h3>
      <div className={styles.courseGrid}>
        {topCourses.length === 0 ? (
          <div className={styles.noCourses}>No courses found.</div>
        ) : (
          topCourses.map((course, idx) => {
            const courseTitle = course.title || course.name || `Course ${idx + 1}`;
            const percent = progressMap[course.id] || progressMap[courseTitle] || 0;
            return (
              <div key={course.id || courseTitle} className={styles.courseCardItem}>
                <h4>{courseTitle}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 500 }}>{percent}%</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '100%',
                      height: 8,
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: 6,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #fff 60%, #bae6fd 100%)',
                        borderRadius: 6,
                        transition: 'width 0.7s cubic-bezier(.4,0,.2,1)'
                      }} />
                    </div>
                  </div>
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