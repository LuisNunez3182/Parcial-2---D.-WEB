<?php
require_once __DIR__ . '/Vehicle.php';

abstract class ElectricVehicle extends Vehicle {
    protected $batteryCapacity;

    public function __construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption, $batteryCapacity, $battery, $range) {
        parent::__construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption);
        $this->batteryCapacity = $batteryCapacity;
        $this->energyType = 'electric';
        $this->battery = $battery;
        $this->range = $range;
    }

    public function getBatteryCapacity() {
        return $this->batteryCapacity;
    }
}
?>
