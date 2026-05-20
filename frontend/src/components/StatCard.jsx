import styles from "../styles/StatCard.module.css";

export default function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper} style={{ background: accent + "18" }}>
        <Icon size={19} color={accent} />
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}
