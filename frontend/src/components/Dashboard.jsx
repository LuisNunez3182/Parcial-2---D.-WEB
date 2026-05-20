// Importamos lucide-react para los iconos
import { Truck, Zap, CheckCircle, Wrench, Fuel } from "lucide-react";
// Importamos el CSS del dashboard
import styles from "../styles/Dashboard.module.css";
// Importamos los componentes que vamos a usar en el dashboard
import StatCard from "./StatCard";
import VehicleCard from "./VehicleCard";

export default function Dashboard({ vehicles, loading }) {
  // Aquie tenemos una const en la que filtramos los vehículos para obtener el número de vehículos activos, en mantenimiento y eléctricos. Esto nos sirve para mostrar las estadísticas en las tarjetas de estadísticas.
  const active = vehicles.filter((v) => v.status === "active").length;
  const maint = vehicles.filter((v) => v.status === "maintenance").length;
  const electric = vehicles.filter((v) => v.type === "electric").length;
  const combustion = vehicles.filter((v) => v.type === "combustion").length;
  // Si el estado de carga es verdadero, mostramos un mensaje de carga en lugar del dashboard. Esto es útil para indicar al usuario que los datos se están cargando y evitar mostrar un dashboard vacío o con datos incompletos.
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Cargando vehículos...</div>
      </div>
    );
  }
  // Retornamos el JSX del dashboard, que incluye un encabezado con el título y subtítulo, una cuadrícula de tarjetas de estadísticas que muestran el total de vehículos, vehículos activos, en mantenimiento y eléctricos, y una sección que muestra los vehículos registrados utilizando el componente VehicleCard para cada vehículo. Si no hay vehículos registrados, se muestra un mensaje indicando que no hay vehículos.
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Flota</h1>
        <p className={styles.subtitle}>
          Vehículos inteligentes DHL — Colombia
        </p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          label="Total vehículos"
          value={vehicles.length}
          icon={Truck}
          accent="#1C1C1E"
        />
        <StatCard
          label="Activos"
          value={active}
          icon={CheckCircle}
          accent="#1B8A3E"
        />
        <StatCard
          label="Mantenimiento"
          value={maint}
          icon={Wrench}
          accent="#B45309"
        />
        <StatCard
          label="Eléctricos"
          value={electric}
          icon={Zap}
          accent="#1455C0"
        />
        <StatCard
          label="Combustión"
          value={combustion}
          icon={Fuel}
          accent="#C05518"
        />
      </div>

      <div className={styles.vehiclesHeader}>
        <h2>Vehículos registrados</h2>
        <span className={styles.vehicleCount}>{vehicles.length} unidades</span>
      </div>

      {vehicles.length > 0 ? (
        <div className={styles.vehiclesGrid}>
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyMessage}>No hay vehículos registrados</div>
      )}
    </div>
  );
}
