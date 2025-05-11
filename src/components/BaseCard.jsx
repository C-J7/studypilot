import styles from "../styles/BaseCard.module.css";
import { motion } from "framer-motion";

const BaseCard = ({ children, className = "", header, title }) => (
    <motion.div
      className={`${styles.cardBase} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(header || title) && (
        <div className={styles.cardHeaderBase}>
          {title && <h3 className={styles.cardTitleBase}>{title}</h3>}
          {header}
        </div>
      )}
      <div className={styles.cardContentBase}>{children}</div>
    </motion.div>
  );
  export default BaseCard;