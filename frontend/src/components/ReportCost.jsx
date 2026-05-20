import { useState } from "react";
import { Calculator } from "lucide-react";
import styles from "../styles/ReportCost.module.css";
import { COLORS } from "../constants/colors";
import { STATUS } from "../constants/status";

export default function ReportCost({ vehicles }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState("all");

  const calculate = () => {
    const vehicle = vehicles.find((x) => String(x.id) === selectedVehicleId);
    if (!vehicle || !distance || !price) return;

    const d = parseFloat(distance);
    const p = parseFloat(price);
    const rawConsumption =
      vehicle.type === "electric"
        ? vehicle.consumption * d
        : (vehicle.consumption / 100) * d;
    const baseCost = rawConsumption * p;
    const loadFactor = 1 + (vehicle.load / 10000) * 0.15;

    setResult({
      vehicle,
      distance: d,
      rawConsumption: rawConsumption.toFixed(2),
      baseCost: baseCost.toFixed(0),
      loadCost: (baseCost * loadFactor).toFixed(0),
      total: (baseCost * loadFactor * 1.05).toFixed(0),
      unit: vehicle.type === "electric" ? "kWh" : "L",
    });
  };

  const reportData =
    filter === "all"
      ? vehicles
      : vehicles.filter(
          (v) => v.type === filter || v.status === filter
        );

  const selectedVehicle = vehicles.find((v) => String(v.id) === selectedVehicleId);

  return (
    <div className={styles.container}>
      {/* Sección izquierda: Costos */}
      <div className={styles.leftSection}>
        <h2 className={styles.sectionTitle}>Calcular costos</h2>
        <p className={styles.sectionSubtitle}>
          Costo operativo estimado por recorrido
        </p>

        <div className={styles.formGroup}>
          <label className={styles.label}>Vehículo</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              setResult(null);
            }}
            className={styles.select}
          >
            <option value="">Seleccionar vehículo...</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} — {v.model}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Distancia (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => {
              setDistance(e.target.value);
              setResult(null);
            }}
            placeholder="150"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Precio energía (COP$/unidad) —{" "}
            {selectedVehicle?.type === "electric" ? "kWh" : "litro"}
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setResult(null);
            }}
            placeholder={
              selectedVehicle?.type === "electric" ? "900" : "5200"
            }
            className={styles.input}
          />
        </div>

        <button onClick={calculate} className={styles.calculateButton}>
          <Calculator size={15} /> Calcular costo
        </button>

        {result && (
          <div className={styles.resultBox}>
            <div className={styles.resultLabel}>Desglose del costo</div>
            <div className={styles.resultGrid}>
              {[
                ["Distancia", result.distance + " km"],
                [
                  "Consumo total",
                  result.rawConsumption + " " + result.unit,
                ],
                [
                  "Costo base",
                  "COP$ " + parseInt(result.baseCost).toLocaleString("es-CO"),
                ],
                ["Factor de carga", "+15%"],
                ["Mantenimiento", "+5%"],
              ].map(([k, val]) => (
                <div key={k} className={styles.resultItem}>
                  <div className={styles.resultItemLabel}>{k}</div>
                  <div className={styles.resultItemValue}>{val}</div>
                </div>
              ))}
            </div>
            <div
              className={styles.totalBox}
              style={{ background: COLORS.RED }}
            >
              <span>Costo total estimado</span>
              <span className={styles.totalAmount}>
                COP$ {parseInt(result.total).toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sección derecha: Reportes */}
      <div className={styles.rightSection}>
        <h2 className={styles.sectionTitle}>Generar reporte</h2>
        <p className={styles.sectionSubtitle}>
          Resumen de la flota según filtro
        </p>

        <div className={styles.filterButtons}>
          {[
            ["all", "Todos"],
            ["electric", "Eléctricos"],
            ["combustion", "Combustión"],
            ["active", "Activos"],
            ["maintenance", "Mant."],
          ].map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`${styles.filterButton} ${
                filter === val ? styles.active : ""
              }`}
              style={{
                borderColor: filter === val ? COLORS.RED : "#EBEBF0",
                background: filter === val ? "#FFF0F0" : "#fff",
                color: filter === val ? COLORS.RED : "#6E6E73",
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        <div className={styles.statsGrid}>
          {[
            ["Vehículos", reportData.length],
            ["Eléctricos", reportData.filter((v) => v.type === "electric").length],
            [
              "Activos",
              reportData.filter((v) => v.status === "active").length,
            ],
          ].map(([k, val]) => (
            <div key={k} className={styles.statItem}>
              <div className={styles.statLabel}>{k}</div>
              <div className={styles.statValue}>{val}</div>
            </div>
          ))}
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {["Placa", "Tipo", "Ciudad", "Consumo", "Estado"].map(
                  (h) => (
                    <th key={h}>{h}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {reportData.map((v, i) => {
                const s = STATUS[v.status] || STATUS.active;
                return (
                  <tr key={v.id} className={i % 2 === 0 ? styles.even : styles.odd}>
                    <td className={styles.plate}>{v.plate}</td>
                    <td>
                      {v.type === "electric" ? "Eléctrico" : "Combustión"}
                    </td>
                    <td>{v.city}</td>
                    <td>
                      {v.consumption}{" "}
                      {v.type === "electric" ? "kWh/km" : "L/100km"}
                    </td>
                    <td>
                      <span
                        className={styles.status}
                        style={{ color: s.color, background: s.bg }}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
