<?php
require_once __DIR__ . '/../models/Vehicle.php';
require_once __DIR__ . '/../models/ElectricVehicle.php';
require_once __DIR__ . '/../models/GasolineVehicle.php';
require_once __DIR__ . '/../models/CargoVan.php';
require_once __DIR__ . '/../models/Truck.php';
require_once __DIR__ . '/../models/ElectricVan.php';
require_once __DIR__ . '/../services/VehicleService.php';
require_once __DIR__ . '/../storages/Vehicles.php';
/* Por si acaso */
date_default_timezone_set('America/Bogota');
/* Iniciamos la sesion */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Access-Control-Allow-Credentials: true');
/*Vehiculos de ejemplo */
if (!isset($_SESSION['vehicles']) || !is_array($_SESSION['vehicles'])) {
    $seedVehicles = [
        new Truck('TRK-051', 'TRK-051', 'Volvo', 'FH16', 'Bogota', 2024, 'Blanco', 4, 18000, 28, 300, 400, 'Diesel'),
        new CargoVan('VAN-002', 'VAN-002', 'Ford', 'Transit', 'Medellin', 2023, 'Azul', 2, 3500, 10.5, 50, 70, 'Gasolina'),
        new ElectricVan('EVN-003', 'EVN-003', 'Mercedes', 'eSprinter', 'Barranquilla', 2024, 'Gris', 4, 2500, 0.2, 55, 40, 240),
    ];
    StorageVehicles::setVehiclesList($seedVehicles);
}

/* Esto es reciclado*/
function estaLogueado(): bool
{
    return isset($_SESSION['usuario']) && !empty($_SESSION['usuario']);
}
?>
