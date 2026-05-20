import { useState } from "react";
import { Zap, Fuel, Plus, Search } from "lucide-react";
import styles from "../styles/RegisterSearch.module.css";
import { COLORS } from "../constants/colors";
import ApiService from "../services/ApiService";
// Componente que combina registro y búsqueda de vehículos
// Permite registrar nuevos vehículos y buscar entre los registrados
const parseMakeModel = (rawModel) => {
  const cleaned = String(rawModel || "").trim();
  if (!cleaned) {
    return { make: "DHL", model: "Generico" };
  }
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) {
    return { make: parts[0], model: parts[0] };
  }
  return {
    make: parts[0],
    model: parts.slice(1).join(" "),
  };
};

const buildBackendPayload = (type, form, kind) => {
  const { make, model } = parseMakeModel(form.model);
  const backendType = kind || (type === "electric" ? "electric_van" : "truck");
  const base = {
    type: backendType,
    make,
    model,
    year: new Date().getFullYear(),
    color: "Blanco",
    capacity: backendType === "truck" ? 18000 : 2500,
  };

  if (backendType === "electric_van") {
    return {
      ...base,
      doors: 4,
      battery_capacity: parseInt(form.battery, 10) || 75,
    };
  }

  if (backendType === "cargo_van") {
    return {
      ...base,
      axles: 2,
      capacity: 3500,
    };
  }

  return {
    ...base,
    axles: 2,
  };
};

function Field({ label, value, onChange, placeholder, itype = "text" }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={itype}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
    </div>
  );
}

export default function RegisterSearch({ vehicles, onAdd, onRefresh }) {
  const [type, setType] = useState("electric");
  const [vehicleKind, setVehicleKind] = useState("electric_van");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    plate: "",
    model: "",
    city: "",
    status: "active",
    battery: "",
    range: "",
    consumption: "",
    fuelType: "diesel",
    tankCap: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = vehicles.filter((v) =>
    [v.plate, v.model, v.city].some((s) =>
      String(s || "").toLowerCase().includes(query.toLowerCase())
    )
  );

  const handleFieldChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!form.plate || !form.model) {
      alert("Placa y modelo son requeridos");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...buildBackendPayload(type, form, vehicleKind),
        plate: form.plate.toUpperCase(),
        city: form.city || "Bogotá",
        status: form.status,
        load: 1000,
        ...(type === "electric"
          ? {
              battery: parseInt(form.battery, 10) || 100,
              range: parseInt(form.range, 10) || 0,
              consumption: parseFloat(form.consumption) || 0.22,
            }
          : {
              fuelLevel: 100,
              consumption: parseFloat(form.consumption) || 9,
              tankCap: parseInt(form.tankCap, 10) || 60,
              fuelType: form.fuelType,
            }),
      };

      const response = await ApiService.createVehicle(payload);

      if (response.success) {
        setForm({
          plate: "",
          model: "",
          city: "",
          status: "active",
          battery: "",
          range: "",
          consumption: "",
          fuelType: "diesel",
          tankCap: "",
        });
        setVehicleKind(type === "electric" ? "electric_van" : "truck");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        if (onRefresh) onRefresh();
      } else {
        alert(response.message || "Error al registrar vehículo");
      }
    } catch (err) {
      alert("Error de conexión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sección izquierda: Registro de vehículos */}
      <div className={styles.leftSection}>
        <h2 className={styles.sectionTitle}>Registrar vehículo</h2>
        <p className={styles.sectionSubtitle}>Ingresa los datos del nuevo vehículo</p>

        {saved && (
          <div className={styles.successMessage}>
            ✓ Vehículo registrado exitosamente
          </div>
        )}

        {/* Type toggle */}
        <div className={styles.typeToggle}>
          {[
            ["electric", "Eléctrico", Zap],
            ["combustion", "Combustión", Fuel],
          ].map(([t, label, Icon]) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setVehicleKind(t === "electric" ? "electric_van" : "truck");
              }}
              className={`${styles.typeButton} ${type === t ? styles.active : ""}`}
              style={{
                borderColor: type === t ? COLORS.RED : "#EBEBF0",
                background: type === t ? "#FFF0F0" : "#fff",
                color: type === t ? COLORS.RED : "#8E8E93",
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de vehículo</label>
          <select
            value={vehicleKind}
            onChange={(e) => setVehicleKind(e.target.value)}
            className={styles.select}
          >
            {type === "electric" ? (
              <option value="electric_van">Van eléctrica</option>
            ) : (
              <>
                <option value="truck">Camión</option>
                <option value="cargo_van">Furgón de carga</option>
              </>
            )}
          </select>
        </div>

        <Field
          label="Placa *"
          value={form.plate}
          onChange={(val) => handleFieldChange("plate", val)}
          placeholder="TRB-049"
        />
        <Field
          label="Modelo *"
          value={form.model}
          onChange={(val) => handleFieldChange("model", val)}
          placeholder="Ford Transit"
        />
        <Field
          label="Ciudad"
          value={form.city}
          onChange={(val) => handleFieldChange("city", val)}
          placeholder="Bogotá"
        />

        <div className={styles.formGroup}>
          <label className={styles.label}>Estado</label>
          <select
            value={form.status}
            onChange={(e) => handleFieldChange("status", e.target.value)}
            className={styles.select}
          >
            <option value="active">Activo</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div className={styles.speciesBox}>
          <div className={styles.speciesLabel}>
            {type === "electric" ? "Datos eléctricos" : "Datos de combustión"}
          </div>
          {type === "electric" ? (
            <>
              <Field
                label="Batería actual (%)"
                value={form.battery}
                onChange={(val) => handleFieldChange("battery", val)}
                placeholder="100"
                itype="number"
              />
              <Field
                label="Autonomía (km)"
                value={form.range}
                onChange={(val) => handleFieldChange("range", val)}
                placeholder="300"
                itype="number"
              />
              <Field
                label="Consumo (kWh/km)"
                value={form.consumption}
                onChange={(val) => handleFieldChange("consumption", val)}
                placeholder="0.22"
                itype="number"
              />
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo combustible</label>
                <select
                  value={form.fuelType}
                  onChange={(e) => handleFieldChange("fuelType", e.target.value)}
                  className={styles.select}
                >
                  <option value="diesel">Diesel</option>
                  <option value="gasolina">Gasolina</option>
                  <option value="gas">Gas natural</option>
                </select>
              </div>
              <Field
                label="Consumo (L/100km)"
                value={form.consumption}
                onChange={(val) => handleFieldChange("consumption", val)}
                placeholder="9.0"
                itype="number"
              />
              <Field
                label="Capacidad tanque (L)"
                value={form.tankCap}
                onChange={(val) => handleFieldChange("tankCap", val)}
                placeholder="70"
                itype="number"
              />
            </>
          )}
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className={styles.registerButton}
          style={{ background: COLORS.RED }}
        >
          <Plus size={15} /> {loading ? "Registrando..." : "Registrar vehículo"}
        </button>
      </div>

      {/* Sección derecha: Búsqueda de vehículos */}
      <div className={styles.rightSection}>
        <h2 className={styles.sectionTitle}>Buscar vehículo</h2>
        <p className={styles.sectionSubtitle}>
          Busca por placa, modelo o ciudad
        </p>

        <div className={styles.searchContainer}>
          <Search size={14} color="#AEAEB2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.resultCount}>
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </div>

        <div className={styles.resultsList}>
          {filtered.map((v) => (
            <div key={`${v.id}-${v.plate || ""}`} className={styles.resultItem}>
              <div
                className={`${styles.resultIcon} ${
                  v.type === "electric" ? styles.electric : styles.combustion
                }`}
              >
                {v.type === "electric" ? (
                  <Zap size={15} color="#1455C0" />
                ) : (
                  <Fuel size={15} color="#C05518" />
                )}
              </div>
              <div className={styles.resultContent}>
                <div className={styles.resultHeader}>
                  <span className={styles.resultPlate}>{v.plate}</span>
                </div>
                <div className={styles.resultModel}>{v.model} · {v.city}</div>
                <div className={styles.resultConsumption}>
                  {v.type === "electric"
                    ? `${v.consumption} kWh/km · ${v.range} km rango`
                    : `${v.consumption} L/100km · ${v.fuelType}`}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className={styles.emptyResults}>
              <Search size={30} color="#D0D0D8" />
              <div>Sin resultados para "{query}"</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
