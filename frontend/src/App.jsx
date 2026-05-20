import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import RegisterSearch from "./components/RegisterSearch";
import ReportCost from "./components/ReportCost";
import ApiService from "./services/ApiService";
import { useAuth } from "./context/AuthContext.jsx";

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeVehicle = (vehicle) => {
  const raw = vehicle || {};
  const energyType = raw.type ?? raw.energyType ?? raw.energy_type;
  const type = energyType === "electric" || raw.type === "electric" ? "electric" : "combustion";
  const plate = raw.plate ?? raw.id ?? "SIN-PLACA";
  const city = raw.city ?? "Bogotá";
  const status = raw.status ?? "active";
  const consumption = toNumberOrNull(raw.consumption) ?? (type === "electric" ? 0.22 : 9);
  const battery =
    toNumberOrNull(raw.battery) ??
    toNumberOrNull(raw.batteryCapacity) ??
    toNumberOrNull(raw.battery_capacity) ??
    100;
  const range = toNumberOrNull(raw.range) ?? 0;
  const fuelLevel = toNumberOrNull(raw.fuelLevel) ?? 100;
  const tankCap = toNumberOrNull(raw.tankCap) ?? 60;
  const fuelType = raw.fuelType ?? (energyType === "gasoline" ? "gasolina" : "diesel");
  const load = toNumberOrNull(raw.load) ?? 1000;

  return {
    ...raw,
    id: raw.id ?? plate,
    type,
    plate,
    city,
    status,
    consumption,
    battery,
    range,
    fuelLevel,
    tankCap,
    fuelType,
    load,
  };
};

function App() {
  const [page, setPage] = useState("login");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: sessionLoading, login, logout } = useAuth();

  // Cargar vehículos al cambiar de página o al iniciar sesión
  useEffect(() => {
    if (user && page !== "login") {
      loadVehicles();
    }
  }, [user, page]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getVehicles();
      if (response.success) {
        const data = response.data || [];
        const list = Array.isArray(data) ? data : [data];
        setVehicles(list.map(normalizeVehicle));
      } else {
        console.error("Error al cargar vehículos:", response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (user) {
      setPage("dashboard");
    } else {
      setPage("login");
      setVehicles([]);
    }
  }, [sessionLoading, user]);

  const handleLogin = (userData) => {
    login(userData);
    setPage("dashboard");
  };

  const handleLogout = async () => {
    await logout();
    setPage("login");
    setVehicles([]);
  };

  const handleAddVehicle = () => {
    loadVehicles();
  };

  if (sessionLoading) {
    return null;
  }

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#F4F4F8",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#F8F8FB",
        }}
      >
        {page === "dashboard" && (
          <Dashboard vehicles={vehicles} loading={loading} />
        )}
        {page === "register-search" && (
          <RegisterSearch
            vehicles={vehicles}
            onAdd={handleAddVehicle}
            onRefresh={loadVehicles}
          />
        )}
        {page === "report-cost" && <ReportCost vehicles={vehicles} />}
      </div>
    </div>
  );
}

export default App;
