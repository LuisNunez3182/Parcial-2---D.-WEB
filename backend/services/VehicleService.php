<?php
require_once __DIR__ . '/../models/CargoVan.php';
require_once __DIR__ . '/../models/Truck.php';
require_once __DIR__ . '/../models/ElectricVan.php';

//Esta función se encarga de crear una instancia del vehículo correspondiente según el tipo especificado en los datos de entrada.
function CreateVehicle($data, $id = null)
{
    $vehicleId = $id ?? uniqid();
    $make = $data['make'];
    $model = $data['model'];
    $year = $data['year'];
    $color = $data['color'];
    $capacity = $data['capacity'];
    $consumption = $data['consumption'] ?? 0;
    $plate = $data['plate'];
    $city = $data['city'];

    switch ($data['type']) {
        case 'cargo_van':
            $axles = $data['axles'];
            $fuelLevel = $data['fuel_level'];
            $tankCap = $data['tank_capacity'];
            $fuelType = $data['fuel_type'];
            return new CargoVan($vehicleId, $plate, $make, $model, $city, $year, $color, $axles, $capacity, $consumption, $fuelLevel, $tankCap, $fuelType);

        case 'truck':
            $axles = $data['axles'];
            $fuelLevel = $data['fuel_level'];
            $tankCap = $data['tank_capacity'];
            $fuelType = $data['fuel_type'];
            return new Truck($vehicleId, $plate, $make, $model, $city, $year, $color, $axles, $capacity, $consumption, $fuelLevel, $tankCap, $fuelType);

        case 'electric_van':
            $doors = $data['doors'];
            $battery = $data['battery'];
            $range = $data['range'];
            $batteryCapacity = $data['battery_capacity'];
            return new ElectricVan($vehicleId, $plate, $make, $model, $city, $year, $color, $doors, $capacity, $consumption, $batteryCapacity, $battery, $range);

        default:
            throw new Exception("Tipo de vehiculo no valido");
    }
}
?>