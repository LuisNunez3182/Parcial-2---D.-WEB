import { Home, Plus, BarChart2, LogOut, User } from "lucide-react";
import styles from "../styles/Sidebar.module.css";
import { COLORS } from "../constants/colors";

export default function Sidebar({ page, setPage, user, onLogout }) {
  const nav = [
    { id: "dashboard", icon: Home, label: "Panel principal" },
    { id: "register-search", icon: Plus, label: "Registrar / Buscar" },
    { id: "report-cost", icon: BarChart2, label: "Reportes / Costos" },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div style={{ background: COLORS.RED, borderRadius: 8, padding: "5px 10px" }}>
          <span
            style={{
              color: COLORS.YELLOW,
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: 1.5,
            }}
          >
            DHL
          </span>
        </div>
        <div>
          <div className={styles.brandName}>FleetOps</div>
          <div className={styles.brandSubtitle}>Sistema de flota</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {nav.map(({ id, icon: Icon, label }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`${styles.navButton} ${active ? styles.active : ""}`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <User size={14} color="#fff" />
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user?.nombre}</div>
            <div className={styles.userRole}>
              {user?.rol === "admin" ? "Administrador" : "Operador"}
            </div>
          </div>
        </div>
        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={13} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
