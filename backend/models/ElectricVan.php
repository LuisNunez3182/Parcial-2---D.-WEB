<?php 
require_once __DIR__ . '/ElectricVehicle.php';

class ElectricVan extends ElectricVehicle {
    private $doors;

    public function __construct($id, $plate, $make, $model, $city, $year, $color, $doors, $capacity, $consumption, $batteryCapacity, $battery, $range) {
        parent::__construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption, $batteryCapacity, $battery, $range);
        $this->doors = $doors;
        $this->wheels = 4; // Las vans tienen 4 ruedas
    }

    public function getDoors() {
        return $this->doors;
    }
    public function getEnergyConsumption() {
        // Supongamos que el consumo de energía se calcula como capacidad * 0.2
        return $this->capacity * 0.2;
    }
    public function getBaseRate() {
        // Supongamos que la tarifa base se calcula como capacidad * 0.1
        return $this->capacity * 0.1;
    }
}
?>
