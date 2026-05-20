<?php
require_once __DIR__ . '/Vehicle.php';

abstract class GasolineVehicle extends Vehicle {

    public function __construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption, $fuelLevel, $tankCap, $fuelType) {
        parent::__construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption);
        $this->energyType = 'gasoline';
        $this->fuelType = $fuelType;
        $this->fuelLevel = $fuelLevel;
        $this->tankCap = $tankCap;
    }
}
?>
