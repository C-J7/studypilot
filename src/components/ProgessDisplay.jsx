// Reusable Progress Component
import styles from "../styles/ProgressDisplay.module.css";
import { motion } from "framer-motion";

const ProgressDisplay = ({ value, className = "" }) => (
    <div className={`${styles.progressBase} ${className}`}>
      <motion.div
        className={styles.progressFill}
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );

  export default ProgressDisplay;