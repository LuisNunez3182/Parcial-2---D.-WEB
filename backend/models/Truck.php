<?php 
require_once __DIR__ . '/GasolineVehicle.php';

class Truck extends GasolineVehicle {
    private $axles;

    public function __construct($id, $plate, $make, $model, $city, $year, $color, $axles, $capacity, $consumption, $fuelLevel, $tankCap, $fuelType) {
        parent::__construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption, $fuelLevel, $tankCap, $fuelType);
        $this->axles = $axles;
        $this->wheels = $axles * 2; // Cada eje tiene 2 ruedas
    }

    public function getEnergyConsumption() {
        // Fórmula de consumo de combustible para camiones
        return ($this->capacity * 0.2) + ($this->axles * 0.5);
    }

    public function getBaseRate() {
        // Fórmula de tarifa base para camiones
        return ($this->capacity * 0.1) + ($this->axles * 0.3);
    }

    public function getAxles() {
        return $this->axles;
    }
}
?>