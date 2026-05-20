# FleetOps — Sistema de Gestión de Flota Inteligente DHL

Bienvenido al repositorio del proyecto **FleetOps**, un sistema web desarrollado con **PHP y React** diseñado para gestionar una flota de vehículos inteligentes para operaciones de logística urbana e intermunicipal en Colombia. El sistema permite registrar, monitorear, buscar, calcular costos operativos y generar reportes de vehículos eléctricos y de combustión, cumpliendo con estrictas reglas de negocio enfocadas en la persistencia mediante variables de sesión y control de acceso basado en autenticación.

## Tecnologías Utilizadas

### Backend
- **PHP 8.x** — Lenguaje de programación del servidor
- **Arquitectura MVC** — Separación de responsabilidades (Modelos, Controladores, Rutas)
- **REST API** — Endpoints para comunicación con el frontend
- **Sesiones PHP** — Almacenamiento de datos (sin base de datos)
- **JSON** — Serialización de datos de vehículos

### Frontend
- **React 18** — Framework para construir la interfaz de usuario
- **Vite** — Bundler y servidor de desarrollo
- **Lucide React** — Biblioteca de iconos
- **CSS Modules** — Estilos componentes encapsulados
- **JavaScript ES6+** — Lógica de cliente

### Patrones Arquitectónicos
- **MVC** — Model-View-Controller en el backend
- **Componentes reutilizables** — En el frontend React
- **Servicios REST** — Para la comunicación cliente-servidor

---

## Estructura del Proyecto

```text
/
├── backend/
│   ├── config/
│   │   └── init.php                     # Inicialización, rutas CORS y seed de vehículos
│   ├── models/
│   │   ├── Vehicle.php                  # Clase base abstracta para vehículos
│   │   ├── ElectricVehicle.php          # Abstracción para vehículos eléctricos
│   │   ├── GasolineVehicle.php          # Abstracción para vehículos de combustión
│   │   ├── ElectricVan.php              # Camioneta eléctrica
│   │   ├── ElectricMotorcycle.php       # Moto eléctrica
│   │   ├── Truck.php                    # Camión de combustión
│   │   ├── CargoVan.php                 # Furgón de carga
│   │   └── GasolineMotorcycle.php       # Moto de gasolina
│   ├── controllers/
│   │   ├── VehicleController.php        # Lógica de CRUD para vehículos
│   │   └── AuthController.php           # Lógica de autenticación
│   ├── services/
│   │   └── VehicleService.php           # Factory de creación de vehículos
│   ├── storages/
│   │   └── Vehicles.php                 # Persistencia en sesión
│   ├── routes/
│   │   └── api.php                      # Definición de rutas REST
│   ├── enums/
│   │   └── Status.php                   # Estados HTTP
│   └── utils/
│       └── Response.php                 # Formateo de respuestas JSON
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx            # Panel de control con estadísticas
│   │   │   ├── RegisterSearch.jsx       # Registro y búsqueda de vehículos
│   │   │   ├── ReportCost.jsx           # Cálculo de costos y reportes
│   │   │   ├── LoginPage.jsx            # Interfaz de autenticación
│   │   │   ├── Sidebar.jsx              # Navegación lateral
│   │   │   ├── VehicleCard.jsx          # Tarjeta individual de vehículo
│   │   │   └── StatCard.jsx             # Tarjeta de estadística
│   │   ├── services/
│   │   │   └── ApiService.js            # Cliente HTTP para el backend
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Estado global de autenticación
│   │   ├── constants/
│   │   │   ├── colors.js                # Paleta de colores
│   │   │   └── status.js                # Estados de vehículos
│   │   ├── styles/
│   │   │   └── *.module.css             # Estilos CSS por componente
│   │   ├── App.jsx                      # Componente raíz
│   │   └── main.jsx                     # Punto de entrada
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── api/
│   └── index.php                        # Router central de la API REST
├── ENUNCIADO.md                         # Requisitos del proyecto
├── SETUP.md                             # Guía de configuración
├── TESTING.md                           # Casos de prueba
└── README.md                            # Este archivo
```

---

## Características Principales

### 1. **Jerarquía de Clases (Herencia)**
```
Vehicle (abstracta)
├── ElectricVehicle (abstracta)
│   ├── ElectricVan
│   └── ElectricMotorcycle
└── GasolineVehicle (abstracta)
    ├── Truck
    ├── CargoVan
    └── GasolineMotorcycle
```

### 2. **Funcionalidades**
- **Registrar vehículos** — Crear nuevos vehículos con datos específicos
- **Mostrar vehículos** — Listado con información de consumo energético
- **Buscar vehículos** — Filtrado por placa, modelo o ciudad
- **Calcular costos operativos** — Incluye IVA y mantenimiento colombiano
- **Generar reportes** — Tabla filtrable por tipo y estado
- **Control de autenticación** — Solo usuarios autenticados

---

## Dinámica y Flujo del Sistema

El sistema opera bajo una arquitectura **API REST + SPA (Single Page Application)**:

1. **Autenticación**: El usuario inicia sesión y se valida contra credenciales en sesión
2. **Gestión de Flota**: El usuario puede registrar, visualizar y buscar vehículos
3. **Análisis de Costos**: Se calcula el costo operativo incluyendo impuestos colombianos (IVA 19%)
4. **Reportes**: Filtrado dinámico de vehículos por tipo y estado

**Características arquitectónicas:**
- Las peticiones GET/POST se procesan a través de una API REST central
- El frontend React se comunica mediante `fetch` con endpoints PHP
- La sesión PHP persiste el estado del usuario y los vehículos
- Los componentes React se re-renderan reactivamente al cambiar datos

---

## Requisitos para Ejecutar el Proyecto

### Backend
- **PHP 8.0+** con soporte para sesiones
- **Apache/Nginx** (puede usarse PHP built-in server para desarrollo)
- **Extensiones PHP**: json (incluida por defecto)

### Frontend
- **Node.js 16+**
- **npm** o **pnpm**

---

## Instalación y Ejecución

### 1. Clonar o descargar el repositorio

```bash
git clone https://github.com/LuisNunez3182/Parcial-2---D.-WEB.git
cd Parcial_2
```

### 2. Configurar y ejecutar el Backend

```bash
# Para usar PHP built-in server (desarrollo)
php -S localhost:8000

# O configurar en Apache/Nginx apuntando a la carpeta raíz del proyecto
# y asegurarse que `api/index.php` es accesible en http://localhost:8000/api/index.php
```

**Nota:** El backend debe estar disponible en `http://localhost:8000/api/index.php`

### 3. Configurar y ejecutar el Frontend

```bash
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
pnpm install
# O si usas npm:
npm install

# Iniciar el servidor de desarrollo
pnpm run dev
# O si usas npm:
npm run dev

# El frontend estará disponible en http://localhost:5173
```

### 4. Acceder a la aplicación

- Abrir navegador en: **http://localhost:5173**
- Usuario de prueba: (Configurable en el backend)
- La API backend debe estar corriendo en paralelo en `http://localhost:8000/api/index.php`

---

## Credenciales de Prueba

Verifica `backend/config/init.php` para las credenciales configuradas. Por defecto:

```php
// Ejemplo (actualizar según tu configuración)
$_SESSION['usuarios'] = [
    'admin' => 'password123',
];
```

---

## Endpoints API Principales

### Autenticación
- `POST /api/index.php/auth/login` — Iniciar sesión
- `POST /api/index.php/auth/logout` — Cerrar sesión
- `GET /api/index.php/auth/current-user` — Obtener usuario actual

### Vehículos
- `GET /api/index.php/vehicles` — Obtener todos los vehículos
- `GET /api/index.php/vehicles/{id}` — Obtener vehículo por ID
- `POST /api/index.php/vehicles` — Crear nuevo vehículo
- `PUT /api/index.php/vehicles/{id}` — Actualizar vehículo
- `DELETE /api/index.php/vehicles/{id}` — Eliminar vehículo

---

## Cálculo de Costos (Colombiano)

El sistema calcula costos operativos incluyendo:

1. **Costo de energía/combustible** = Consumo × Precio unitario
2. **Factor de carga** = +15% según peso transportado
3. **Mantenimiento** = 5% del costo operativo
5. **Costo Total** = (Energía + Carga + Mantenimiento)

Todos los valores se expresan en **COP$ (Pesos Colombianos)**.

---

## Estructura MVC

### Modelos (`backend/models/`)
Define la jerarquía de clases de vehículos con métodos para cálculos de consumo y tarifas.

### Vistas (`frontend/src/components/`)
Componentes React que renderean la interfaz basada en estado.

### Controladores (`backend/controllers/`)
Manejan la lógica de negocio y orquesan modelos y almacenamiento.

### Rutas (`backend/routes/api.php`)
Mapean URLs a métodos de controlador.

---

## Notas Importantes

- **Sin persistencia de BD**: Los datos se pierden al reiniciar el servidor o expirar la sesión
- **CORS habilitado**: Para permitir solicitudes desde el frontend
- **Diseño responsive**: La UI se adapta a dispositivos móviles

---

## Autor

- **Luis Ernesto Nuñez Celis** 
