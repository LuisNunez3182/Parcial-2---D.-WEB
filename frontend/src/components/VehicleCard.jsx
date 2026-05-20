import { Zap, Fuel, MapPin } from "lucide-react";
import styles from "../styles/VehicleCard.module.css";
import { STATUS } from "../constants/status";

export default function VehicleCard({ vehicle }) {
  console.log(vehicle)
  const statusKey = vehicle?.status ?? "active";
  const s = STATUS[statusKey] || STATUS.active;
  const isElectric = vehicle?.type === "electric";
  const level = isElectric ? vehicle?.battery : vehicle?.fuelLevel;
  console.log(level)
  const levelValue = Number.isFinite(Number(level)) ? Number(level) : 100;
  const displayLevel = Math.max(0, Math.min(100, levelValue));
  
  let levelColor = "#1B8A3E"; // verde
  if (displayLevel <= 50) levelColor = "#B45309"; // naranja
  if (displayLevel <= 25) levelColor = "#D40511"; // rojo

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.vehicleInfo}>
          <div className={`${styles.typeIcon} ${isElectric ? styles.electric : styles.combustion}`}>
            {isElectric ? (
              <Zap size={17} color="#1455C0" />
            ) : (
              <Fuel size={17} color="#C05518" />
            )}
          </div>
          <div>
            <div className={styles.plate}>{vehicle.plate}</div>
            <div className={styles.model}>{vehicle.model}</div>
          </div>
        </div>
        <span className={styles.status} style={{ color: s.color, background: s.bg }}>
          {s.label}
        </span>
      </div>

      <div className={styles.location}>
        <MapPin size={11} color="#AEAEB2" />
        <span>{vehicle.city}</span>
      </div>

      <div className={styles.levelContainer}>
        <div className={styles.levelHeader}>
          <span>{isElectric ? "Batería" : "Combustible"}</span>
          <span style={{ color: levelColor }}>{displayLevel}%</span>
        </div>
        <div className={styles.levelBar}>
          <div
            className={styles.levelFill}
            style={{ width: displayLevel + "%", background: levelColor }}
          />
        </div>
      </div>

      <div className={styles.details}>
        {isElectric ? (
          <span>
            Consumo: <b>{vehicle.consumption} kWh/km</b> · Rango:{" "}
            <b>{vehicle.range} km</b>
          </span>
        ) : (
          <span>
            Consumo: <b>{vehicle.consumption} L/100km</b> · Tanque:{" "}
            <b>{vehicle.tankCap} L</b>
          </span>
        )}
      </div>
    </div>
  );
}
